#!/usr/bin/env python

import sys
from os import path
from datetime import datetime

HEADER = """\
---
layout: post
title: "{title}"
date: "{now}"
author: "Rohitt Shinde"
tags:
- tag1
- tag2
---


"""

current_time = datetime.now()
day = current_time.strftime("%Y-%m-%d")
hours = current_time.strftime("%H:%M")
title = " ".join(sys.argv[1:])
filename = day + "-" + title.replace(' ', '-') + '.markdown'


HEADER = HEADER.format(
    title = title,
    now = day + ' ' + hours,
)

target_path = path.join('_posts', filename)
with open(target_path, 'wt') as file_out:
    file_out.write(HEADER)

print 'File is at ', target_path
