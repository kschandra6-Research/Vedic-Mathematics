Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentFolder = fso.GetParentFolderName(WScript.ScriptFullName)
htmlPath = currentFolder & "\index.html"
WshShell.Run """" & htmlPath & """", 1, False
