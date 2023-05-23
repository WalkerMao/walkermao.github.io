---
layout: post
title:  "Notes on Spinning Up in Deep RL - Part 1"
date: 9999-01-01
categories: RL
tags: []
toc: false
published: true
hidden: false
comments: true
---

# [Part 1: Key Concepts in RL](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)

In a nutshell, RL is the study of agents and how they learn by trial and error. It formalizes the idea that rewarding or punishing an agent for its behavior makes it more likely to repeat or forego that behavior in the future.

## [What Can RL Do?](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html#id3)

There is a wide variety of usages. For example, RL has been used to teach computers to control robots and play strategy games.

## [Key Concepts and Terminology](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html#id4)

<div align='center'>
<figure>
<img src="https://spinningup.openai.com/en/latest/_images/rl_diagram_transparent_bg.png" alt="../_images/rl_diagram_transparent_bg.png" style="zoom:100%;" />
<figcaption style="font-size:80%;"> Agent-environment interaction loop. (<a href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html#id4">Source</a>) </figcaption>
</figure>
</div>

The main characters of RL are the **agent** and the **environment**. The environment is the world that the agent lives in and interacts with. At every step of interaction, the agent sees a (possibly partial) observation of the state of the world, and then decides on an action to take. The environment changes when the agent acts on it, but may also change on its own.

The agent also perceives a **reward** signal from the environment, a number that tells it how good or bad the current world state is. The goal of the agent is to maximize its cumulative reward, called **return**. Reinforcement learning methods are ways that the agent can learn behaviors to achieve its goal.

Some additional terminologies in RL:

- states and observations,
- action spaces,
- policies,
- trajectories,
- different formulations of return,
- the RL optimization problem,
- and value functions.

### States and Observations

A **state** $$s$$ is a complete description of the state of the world. An **observation** $$o$$ is a partial or complete description of a state. Agent has access to the observation but not the state.

### Action Spaces

The set of all valid actions in a given environment is often called the **action space**. 

### Policies

A **policy** is a rule used by an agent to decide what actions to take. It is essentially the agent's brain.

It can be deterministic, in which case it is usually denoted by $$\mu$$:
$$
a_t = \mu(s_t),
$$
or it may be stochastic, in which case it is usually denoted by $$\pi$$:
$$
a_t \sim \pi(\cdot \mid s_t).
$$

#### Deterministic Policies

#### Stochastic Policies



<br>

## References

[^1]: [Spinning Up in Deep RL](https://spinningup.openai.com/en/latest/index.html)
