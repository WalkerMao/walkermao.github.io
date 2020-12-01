---
layout: post
title: "Linux Command Memo"
date: 2020-11-15
categories: CS
published: true
comments: true
---

### Navigation

`pwd`: Print name of current working directory

`cd`: Change directory

`ls`: List directory contents

### Exploring the System

`file`: View a brief description of the file contents

`less`: View file contents

### Manipulating Files and Directories

`cp`: Copy files and directories

`mv`: Move/rename files and directories

`mkdir`: Create directories

`rm`: Remove files and directories

`ln`: Create hard and symbolic links

### Working with Commands

`type`: Indicate how a command name is interpreted

`which`: Display which executable program will be executed

`help`: Get help for shell builtins

`man`: Display a command's manual page

`apropos`: Display a list of appropriate commands

`info`: Display a command's info entry

`whatis`: Display one-line manual page descriptions

`alias`: Create an alias for a command

### Redirection

`cat`: Concatenate files

`sort`: Sort lines of text

`uniq`: Report or omit repeated lines

`grep`: Print lines matching a pattern

`wc`: Print newline, word, and byte counts for each file

`head`: Output the first part of a file

`tail`: Output the last part of a file

`tee`: Read from standard input and write to standard output and files

### Seeing the World as the Shell Sees It

`echo`: Display a line of text

### Advanced Keyboard Tricks

`clear`: Clear the screen

`history`: Display the contents of the history list

### Permissions

`id`: Display user identity

`chmod`: Change a file's mode

`umask`: Set the default file permissions

`su`: Run a shell as another user

`sudo`: Execute a command as another user

`chown`: Change a file's owner

`chgrp`: Change a file's group ownership

`passwd`: Change a user's password

### Processes

`ps`: Report a snapshot of current processes

`top`: Display tasks

`jobs`: List active jobs

`bg`: Place a job in the background

`fg`: Place a job in the foreground

`kill`: Send a signal to a process

`killall`: Kill processes by name

`shutdown`: Shutdown or reboot the system

### The Environment

`printenv`: Print part or all of the environment

`set`: Set shell options

`export`: Export environment to subsequently executed programs

`alias`: Create an alias for a command

### Storage Media

`mount`: Mount a file system

`umount`: Unmount a file system

`fsck`: Check and repair a file system

`fdisk`: Manipulate disk partition table

`mkfs`: Create a file system

`dd`: Convert and copy a file

`genisoimage (mkisofs)`: Create an ISO 9660 image file

`wodim (cdrecord)`: Write data to optical storage media

`md5sum`: Calculate an MD5 checksum

### Networking

`ping`: Send an ICMP ECHO_REQUEST to network hosts

`traceroute`: Print the route packets trace to a network host

`ip`: Show / manipulate routing, devices, policy routing and tunnels

`netstat`: Print network connections, routing tables, interface statistics, masquerade connections, and multicast memberships

`ftp`: Internet file transfer program

`wget`: Non-interactive network downloader

`ssh`: OpenSSH SSH client (remote login program)

### Searching for Files

`locate`: Find files by name

`find`: Search for files in a directory hierarchy

`xargs`: Build and execute command lines from standard input

`touch`: Change file times

`stat`: Display file or file system status

### Archiving and Backup

`gzip`: Compress or expand files

`bzip2`: A block sorting file compressor

`tar`: Tape archiving utility

`zip`: Package and compress files

`rsync`: Remote file and directory synchronization

### Text Processing

`cat`: Concatenate files and print on the standard output

`sort`: Sort lines of text files

`uniq`: Report or omit repeated lines

`cut`: Remove sections from each line of files

`paste`: Merge lines of files

`join`: Join lines of two files on a common field

`comm`: Compare two sorted files line by line

`diff`: Compare files line by line

`patch`: Apply a diff file to an original

`tr`: Translate or delete characters

`sed`: Stream editor for filtering and transforming text

`aspell`: Interactive spell checker

### Formatting Output

`nl`: Number lines

`fold`: Wrap each line to a specified length

`fmt`: A simple text formatter

`pr`: Prepare text for printing

`printf`: Format and print data

`groff`: A document formatting system

### Printing

`pr`: Convert text files for printing

`lpr`: Print files

`a2ps`: Format files for printing on a PostScript printer

`lpstat`: Show printer status information

`lpq`: Show printer queue status

`lprm`: Cancel print jobs

### Compiling Programs

`make`: Utility to maintain programs

<br>

**Reference**:

Shotts, William. *The Linux command line: a complete introduction*. No Starch Press, 2019.