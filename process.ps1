$symptoms = Get-Content "symptoms.txt"
$newEntries = @()
foreach ($s in $symptoms) {
    if ($s.Trim() -ne "") {
        $key = $s.Trim().ToLower()
        $entry = "    `"$key`": {`n" +
                 "        explanation: `"$s could be caused by fatigue, environmental factors, or minor localized inflammation.`",`n" +
                 "        solution: `"Rest and stay hydrated. Apply basic self-care and monitor the condition closely over the next 48 hours.`",`n" +
                 "        diet: `"Eat a balanced diet rich in whole foods, vitamin C, and drink plenty of water to help your body recover.`",`n" +
                 "        followUps: [`"How long have you been experiencing $key?`", `"Is the feeling constant, or does it come and go?`", `"On a scale of 1 to 10, how severe is it?`"]`n" +
                 "    }"
        $newEntries += $entry
    }
}

$kb = Get-Content "knowledgeBase.js" -Raw
$injStr = "const explicitData = {"
$idx = $kb.IndexOf($injStr)
if ($idx -ge 0) {
    $idx += $injStr.Length
    $newKb = $kb.Substring(0, $idx) + "`n" + ($newEntries -join ",`n") + ",`n" + $kb.Substring($idx)
    Set-Content "knowledgeBase.js" -Value $newKb -Encoding UTF8
    Write-Host "Successfully injected $($newEntries.Count) new symptom matrices into knowledgeBase.js."
} else {
    Write-Host "Could not find explicitData insertion point."
}
