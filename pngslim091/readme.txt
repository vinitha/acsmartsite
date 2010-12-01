
pngslim v0.91 (WinXP)
 - when every byte counts!
 Andrew C.E. Dent, 2007.


Batch optimization of PNG images using PNGREWRITE, OptiPNG, PNGOUT, AdvDEF 
and DeflOpt to minimize file sizes with (almost) reasonable speed.

For a nice and fast PNG optimizer, checkout 'PNGOUTWin' http://www.ardfry.com
PNGOUTWin takes full advantage of the latest multi-core CPUs and is
available as a Photoshop plugin. (I have no affiliation with Ardfry.com).
WARNING: Although this software produces fully compliant PNG images, a
minority of image editors, viewers and certain mobile phones contain bugs
which may cause problems displaying these optimized images. This software
doesn't currently provide compatibility hacks that would degrade compression.


Usage
=====

1. Unzip the 'pngslim' folder and place in your chosen location.
2. Then just drag-n-drop* your PNG files onto 'pngslim.cmd' to run.
3. Have fun slimming away those surplus bytes! :-)

For advanced users please tweak the script to your needs**.
- When time is no object or your images are small, try more trials:
  MinBlockSize=128, LimitBlocks=512, RandomTrials=1000.
- The defaults are for icon like images (<48x48px). For larger images try:
  MinBlockSize=1, LimitBlocks=2, RandomTrials=1.
For faster compression it is possible to delete different stages of the script.
'Stage03' is the slowest and yields the smallest compression gain. For fastest
results but poor compression, just run Stage01, 04 & 99 (avoiding pngout).

* Note for MS Windows users, due to limitations of the OS the maximum number of
files that you can drag-n-drop, depends on the total text length of the image
file paths+names. If you see the following error message:
"Windows cannot access the specified device, path, or file...",
you should reduce the number of selected files per drag-n-drop (typically <100),
and consider moving your files to shorten the path names (e.g. "C:\png\").

** Default settings: MinBlockSize=128, LimitBlocks=256, RandomTrials=100.


Legal
=====

The software ('pngslim' script) is provided 'as-is', without any express or
implied warranty. In no event will the author be held liable for any damages
arising from the use of this software. Permission is granted to anyone to use
this software for any purpose, including commercial applications, and to alter
it and redistribute it freely*. The software is dedicated to the Public Domain.

Note, the additional software included in the 'pngslim' package is provided for
convenience. The additional software is the property of other authors and
may be subject to different licensing and legal conditions. Please check the
original authors' websites for details and latest information.

* The license for 'pngout.exe' restricts how the software may be distributed:
http://www.advsys.net/ken/utils.htm#pngoutkziplicense . Its inclusion is by
kind permission of K.Silverman and D.Blake. Therefore, you may not redistribute
the pngslim package with 'pngout.exe' without prior arrangement.


History
=======

v0.91 21-August-2007
- Added 'VersionText' variable for identifying customized scripts (i.e. 'Fast',
'Extreme', etc.)
- Check added for detecting 'zlib.dll'.
- First step of uncompressing PNG with pngout now always uses RGBA (-c6).
- Reordered trials in 'Stage02' and added a pngout trial with some default
settings. This may occasionally find better color and filter parameters,
improving compression.
- Used UPX 3.00 (--ultra-brute) to compress the packaged software except for
pngout.exe and optipng.exe (it seems the originals are already compressed).
- Updated 'readme.txt', reformatted for fixed width and included details of
'pngout' license.

v0.9 09-July-2007
- Fixed missing quotes for checking if required programs are present.
- Reduced range of Huffman blocks tested (Trial 2) for quicker processing.
- Slight syntax changes for future porting efforts.
- After Stage01 (where metadata is stripped), all further compression stages
have been set to preserve meta data (-k1). Hence, ancillary chunks can be kept
by editing the script to skip the first stage.
- Updated the included software to latest versions.
- Removed the 'pngexpand' script. I believe few users would benefit from it.
- Updated 'readme.txt'. Added warning for mobile phone developers.

v0.8 20-Jan-2007
- The pngslim directory is now set automatically by reading the directory of
the script and setting the executable search path to this directory. This
removes the need to edit the script manually; More user friendly.
- The minimum block size was increased to be more practical (64 > 128bytes),
reducing number of trials (hence time) for larger images.
- Unsupported formats of png files (e.g. 16bpp) are checked for and skipped.
- Window title is more compact for easier viewing when minimized.
- Added 'pngexpand' script to help avoid bugs in Photoshop and other editors.
- 'readme.txt' file cleaned up.

v0.7 04-Jan-2007
- Stage02: Initial compression with Optipng tests all filters (0-5).
- Stage02/Trial3: Added /s0 to test default Huffman tables and improve
compression before Stage03.

v0.6 01-Jan-2007
- First public release.


Included programs
=================

Note: I have no affiliation with the authors of the included software.
Please read the comments under the 'Legal' section of this readme!

- advdef.exe (and zlib.dll) v1.15 (31-Oct-2005) 
   http://advancemame.sourceforge.net/comp-readme.html

- DeflOpt.exe v2.06 (28-Apr-2007) by B.J.Walbeehm 
   http://www.walbeehm.com/download/

- OptiPNG.exe v0.5.5 (28-Jan-2007) by C.Truta
   http://optipng.sourceforge.net/

- pngout.exe (22-Apr-2007) by K.Silverman
   http://advsys.net/ken/utils.htm

- pngrewrite.exe v1.2.1 (9-Feb-2003) by J.Summer
   http://entropymine.com/jason/pngrewrite/


Thanks!
=======

Inspiration came from a script by JensRex (jens@jensrex.net) 6-11-2005
(http://hydrogenaudio.org/forums/?showtopic=22036).
Big thanks to: D.Blake, counting_pine, markcramer, K.Silverman, Sined,
Thundik81, C.Truta, UncleBuck, Zardalu and others.


http://people.bath.ac.uk/ea2aced/tech/png/pngslim.zip
012345678-1-2345678-2-2345678-3-2345678-4-2345678-5-2345678-6-2345678-7-2345678-8