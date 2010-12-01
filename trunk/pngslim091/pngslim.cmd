@echo off
:: pngslim v0.91 (21-August-2007) WinXP version
:: By Andrew C.E. Dent, dedicated to the Public Domain.

set MinBlockSize=128
set LimitBlocks=256
set RandomTrials=100
set VersionText=(v0.91)


:: Check programs are available for the script
set PngDir=%~dp0
PATH %PngDir%;%PATH% >nul
if not exist "%PngDir%advdef.exe" goto theend
if not exist "%PngDir%DeflOpt.exe" goto theend
if not exist "%PngDir%optipng.exe" goto theend
if not exist "%PngDir%pngout.exe" goto theend
if not exist "%PngDir%pngrewrite.exe" goto theend
if not exist "%PngDir%zlib.dll" goto theend
:: Check some png files have been provided
if .%1==. (
 echo Drag-and-drop a selection of PNG files to optimize them.
 goto theend
)
set zs=0
set TotalBytes=0
for %%i in (%*) do set /a TotalFiles+=1


:start
set /a PngNum+=1
if /I %~x1 NEQ .png goto nextfile
title [%PngNum%/%TotalFiles%] pngslim %VersionText%
echo %~z1b - Optimizing: %1
set z0=%~z1
copy %1 %1.backup >nul

:stage01
pngout.exe -s4 -f0 -c6 -k0 -force %1 | find /I "unsupported format" > nul
if NOT errorlevel 1 (
 echo Cannot compress: Unsupported PNG format.
 goto stage99
)
set /a MaxBlocks=%~z1/%MinBlockSize%
if %MaxBlocks% GTR %LimitBlocks% set MaxBlocks=%LimitBlocks%
pngrewrite.exe %1 %1
echo %~z1b - Deleted metadata and palette optimized.

:stage02
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c3 -d0 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c3 -d8 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c0 -d0 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c0 -d8 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c2 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c6 %1
for %%i in (0,5) do pngout.exe -q -k1 -n1 -s1 -f%%i -c4 %1
for %%i in (1,2,3,4) do pngout.exe -q -k1 -ks -n1 -s1 -f%%i %1
optipng.exe -q -zc9 -zm8 -zs0-3 -f0-5 %1
pngout.exe -q -k1 -s1 %1
echo %~z1b - Compression trial 1 complete (color and filter type).
for /L %%i in (2,1,%MaxBlocks%) do pngout.exe -q -k1 -ks -s1 -n%%i %1
echo %~z1b - Compression trial 2 complete (no. of Huffman blocks).
for %%i in (3,2,0) do pngout.exe -q -k1 -ks -s%%i %1
echo %~z1b - Compression trial 3 complete (pngout strategy).

:stage03
set StartSize=%~z1
echo %~z1b - Compression trial 4 running...
for /L %%i in (1,1,%RandomTrials%) do pngout.exe -q -k1 -ks -s0 -r %1
if %~z1 LSS %StartSize% goto stage03
echo %~z1b - Compression trial 4 complete (randomized Huffman tables).

:stage04
for %%i in (32k,16k,8k,4k,2k,1k,512) do optipng.exe -q -nb -nc -zw%%i -zc1-9 -zm1-9 -zs0-3 -f0-5 %1
for /L %%i in (1,1,4) do advdef.exe -q -z%%i %1
deflopt.exe -s -k %1 >nul
echo %~z1b - Final compression sweep finished.

:stage99
if %~z1 GEQ %z0% (
 del %1
 rename "%~1.backup" "%~nx1"
 echo Original file restored; could not compress further.
)
set /a zs=%z0%-%~z1
set /a TotalBytes+=%zs%
if %~z1 LSS %z0% (
 del %1.backup
 echo Optimized: "%~n1". Slimmed %zs% bytes.
)

:nextfile
echo.
shift
if .%1==. goto close
goto start


:close
title Optimization complete.
echo.
echo Finished %date% %time% - pngslim %VersionText%.
echo Processed %TotalFiles% files. Slimmed %TotalBytes% bytes.

:theend
pause
title %ComSpec%
