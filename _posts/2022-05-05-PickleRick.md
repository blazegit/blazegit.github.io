---
title: Pickle Rick
date: 2022-05-05 17:00:00 +500
categories: [THM, easy machines]
tags: []    # TAG names should always be lowercase
---

![](https://i.imgur.com/o9pyhyU.jpg)

## Pickle Rick

This Rick and Morty-themed challenge requires you to exploit a web server and find three ingredients to help Rick make his potion and transform himself back into a human from a pickle.

10.10.194.5
### What is the first ingredient that Rick needs?

nmap scan:
```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 d7b1da29ab17b54252e019abb1e300ed (RSA)
|   256 7237bf480a7698f3e4a8797262371453 (ECDSA)
|_  256 d7461786e7728168e2f1e7e08e7b2bc9 (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Rick is sup4r cool
|_http-server-header: Apache/2.4.18 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

let's head over to the webpage and see what we can find, the home page is Rick asking us for help, we need to find the last three secret ingredients to finish his pickle-reserve potion.

looking around I found a note on the source page:
```
  Note to self, remember username!
  Username: R1ckRul3s
```

now we have a username, that may be use to brute force some login page or the ssh service, anyway, there's nothing much around, so I'll do a gobuster scan.

```terminal
gobuster dir -u http://10.10.194.5/ -w /usr/share/dirb/wordlists/common.txt -x .php
```

```
/assets               (Status: 301) [Size: 311] [--> http://10.10.194.5/assets/]
/denied.php           (Status: 302) [Size: 0] [--> /login.php]
/index.html           (Status: 200) [Size: 1062]
```
after a while, with gobuster, trying a small and big wordlist, and trying with php extension I found a login page under /denied.php that redirects to /login.php, so I guess what's left now is to brute force this login with hydra.

```terminal
hydra -l R1ckRules -P /usr/share/wordlists/rockyou.txt 10.10.194.5 http-post-form "/login.php:username=^USER^&password=^PWD^&sub=Login:Invalid username or password."
```

This actually doesn't find a password, and after some time looking around I tried the text that was on /robots.txt 'Wubbalubbadubdub', and it was!

logged in, we have a page with different tabs that we can't access, getting a message that says only the real Rick can view this page, but in the first tab, the "commands" we have a command panel that after trying whoami, it looks like it's a shell from the web server the usual www-data user.

The first thing I tried after that was a bash reverse shell but I got "
Command disabled to make it hard for future PICKLEEEE RICCCKKKK." so no luck with that.

I can list files, and I apparently got the first ingredient
```
Sup3rS3cretPickl3Ingred.txt
assets
clue.txt
denied.php
index.html
login.php
portal.php
robots.txt
```

but cat was disabled too.

I noticed that those were the page files so tried to see the file through the URL, and I can!

> mr. meeseek hair

### What is the second ingredient in Rick’s potion?

In the clue.txt file, we get "Look around the file system for the other ingredient.", I found the second ingredient in rick's home folder, but I can't read it.

after getting stuck for a little I checked the john hammond video on this machine, and what I lack was more enum, the machine had python3 installed, and the blocked commands weren't a lot also.

so with this, I headed over to revshells.com and got a python3 rev shell and it worked!

the first thing we spawn a better shell with Python, now that we know it's installed

```terminal
python3 -c "import pty;pty.spawn('/bin/bash')"
```

I read it the second ingredient, which was in a file with a space, as a note* in Linux when we want to refer to a file with a space in its name we use the backslash '\', so it'll be

```terminal
cat second\ ingredients
```

> 1 jerry tear

### What is the last and final ingredient?

now what it's left as usual I guess is the privilege escalation, I run sudo -l to see what I can run as sudo, and apparently, everything. so with sudo bash, we create a terminal as root.

I started to search for something in the other user created, and as I was checking the bash_history, there it was! the third ingredient. *also was in the root directory which I'm pretty sure was the intended way.

> fleeb juice