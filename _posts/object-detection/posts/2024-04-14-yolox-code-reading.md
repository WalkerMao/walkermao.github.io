---
layout: post
title: "YOLOX Code Reading"
date: 2024-04-14
categories: CV DL
tags: [Object detection, CNN]
published: false
hidden: true
comments: true
---

## Code Reading

class CSPLayer: C3 block in YOLOv5, CSP Bottleneck with 3 convolutions.

class SPPBottleneck: SPP layer used in YOLOv3-SPP.

class YOLOPAFPN: Backbone (class CSPDarknet) and neck (PAFPN, PANet)

YOLOX-m:

- Backbone, class CSPDarknet: input -> stem -> dark2 -> dark3 -> dark4 -> dark5 -> output
  - Input: transformed batch images (b, c, w, h)
  - Stem, class Focus:
    - slice, concat: out (b, 4c, w/2, h/2)
    - class Conv: out (b, 16c, w/2, h/2)
  - Dark2:
    - class Conv: out (b, 32c, w/4, h/4)
    - class CSPLayer: out (b, 32c, w/4, h/4)
  - Dark3:
    - class Conv: out (b, 64c, w/8, h/8)
    - class CSPLayer: out (b, 64c, w/8, h/8)
  - Dark4:
    - class Conv: out (b, 128c, w/16, h/16)
    - class CSPLayer: out (b, 128c, w/16, h/16)
  - Dark5:
    - class Conv: out (b, 256c, w/32, h/32)
    - class SPPBottleneck: out (b, 256c, w/32, h/32)
    - class CSPLayer: out (b, 256c, w/32, h/32)
  - Output: dark3, dark4, dark5 outputs
- Neck, class YOLOPAFPN, almost same to YOLOv5‘s neck:
  - <img src="https://www.researchgate.net/publication/360834230/figure/fig1/AS:1159461314002959@1653448527847/The-architecture-of-the-YOLOv5-model-which-consists-of-three-parts-i-Backbone.ppm" alt="The architecture of the YOLOv5 model, which consists of three parts: (i) Backbone: CSPDarknet, (ii) Neck: PANet, and (iii) Head: YOLO Layer. The data are initially input to CSPDarknet for feature extraction and subsequently fed to PANet for feature fusion. Lastly, the YOLO Layer outputs the object detection results (i.e., class, score, location, size)." style="zoom:100%;" />
  - in dark5’s output x0 (b, 256c, w/32, h/32), lateral_conv0 BaseConv, out fpn_out0 (b, 128c, w/32, h/32)
  - in fpn_out0 (b, 128c, w/32, h/32), upsample, concat dark4’s output x1, C3_p4 CSPLayer, reduce_conv1, out fpn_out1 (b, 64c, w/16, h/16)
  - in fpn_out1 (b, 64c, w/16, h/16), BaseConv, upsample, concat dark3’s output x2, C3_p3 CSPLayer, out pan_out2 (b, 64c, w/8, h/8)
  - in pan_out2 (b, 64c, w/8, h/8), out pan_out1 (b, 128c, w/16, h/16)
  - in pan_out1 (b, 128c, w/16, h/16), out pan_out0 (b, 256c, w/32, h/32)
  - Output: pan_out2, pan_out1, pan_out0

- Head, class YOLOXHead
  - YOLOX代码中的YOLOXHead的get_losses方法中，preds_ious_this_matching是预测框和真实框的IoU，cls_preds是cls分支self.cls_preds的输出，cls_target是cls_preds的学习目标，cls_target并不是简单的class label的one hot 0或1，而是class label one hot * preds_ious_this_matching，也就是说cls分支预测的类别分数cls_preds其实是预测的IoU，也就是预测框和真实框的IoU，后续做NMS时的分数是cls_preds * obj_preds
  - Head2 cls branch: in pan_out2 (b, 64c, w/8, h/8), cls_conv 2 Conv, cls_pred nn.Conv2d, sigmoid, out cls_output (b, cls_num, w/8, h/8)
  - Head2 reg branch: in pan_out2 (b, 64c, w/8, h/8), reg_conv 2 Conv
    - reg_pred nn.Conv2d, out reg_output (b, 4, w/8, h/8)
    - obj_pred nn.Conv2d, sigmoid, out obj_output (b, 1, w/8, h/8)
  - Head1: in pan_out1 (b, 128c, w/16, h/16), out reg_output (b, 4, w/16, h/16), out obj_output (b, 1, w/16, h/16)
  - Head0: in pan_out0 (b, 256c, w/32, h/32), out reg_output (b, 4, w/32, h/32), out obj_output (b, 1, w/32, h/32)
- Loss, class YOLOXHead
  - Head2: concat reg_output, obj_output, cls_output to (b, 6, w/8, h/8), process box values, out (b, w/8*h/8, 6)
  - Head1: concat reg_output, obj_output, cls_output to (b, 6, w/16, h/16), process box values, out (b, w/16*h/16, 6)
  - Head0: concat reg_output, obj_output, cls_output to (b, 6, w/32, h/32), process box values, out (b, w/32*h/32, 6)
  - Concat previous outputs to (b, w/8*h/8+w/16*h/16+w/32*h/32, 6)
  - get_assignments func: SimOTA label assignment algorithm
  - get_losses func:
    - in bbox_preds with fg_masks, in reg_targets, out loss_iou
    - in obj_preds without fg_masks, in obj_targets, nn.BCEWithLogitsLoss, out loss_obj
    - in cls_preds with fg_masks, in cls_targets, nn.BCEWithLogitsLoss, out loss_cls
    - Output: loss = (reg_weight (default 5) * loss_iou + loss_obj + loss_cls + loss_l1) / num_fg (foreground number)
- Update parameters, Trainer.train_one_iter
  - Input: loss / total loss
  - self.scaler (torch.cuda.amp.GradScaler)
  - Mini batch gradient descent: self.optimizer
  - EMA for model parameters: self.model_ema
  - Cosine learning rate scheduler with warmup: self.lr_scheduler
  - Stores time, lr, loss: self.meter
- Others in class Trainer:
  - Trainer.after_iter:
    - Log: log time, lr, loss
    - Random resizing: self.exp.random_resize
  - Trainer.after_epoch:
    - Update EMA attributes
    - Save checkpoint
    - all_reduce_norm function. All reduce norm statistics (e.g. mean, std) across different devices. Async norm states include nn.BatchNorm, nn.InstanceNorm. Refer to torch.distributed.all_reduce
    - Evaluate and save the best model. COCOEvaluator.evaluate(): 
      - Inference eval data: eval no_grad, out outputs
      - COCOEvaluator.postprocess(): in outputs, cxcywh to ltrb, get class with highest class conf, filter predictions according to class_conf*obj_conf with conf_thre/test_conf 0.001, NMS with nms_thre 0.7, output postprocessed outputs
      - COCOEvaluator.convert_to_coco_format()
      - COCOEvaluator.evaluate_prediction(): evaluate AP
