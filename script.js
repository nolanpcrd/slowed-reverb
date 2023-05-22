const inputFile = document.getElementById('fileInput');
const startButton = document.getElementById('start');
const downloadButton = document.getElementById('download');
var selectedFile;

alert("doesn't work right now, problem with ffmpeg-core.js");

inputFile.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    console.log(selectedFile);
});

startButton.addEventListener('click', () => {
    const slowPercentage = document.getElementById('slow').value;
    const reverbPercentage = document.getElementById('reverb').value;
    applySlowedReverb(selectedFile, slowPercentage, reverbPercentage);
});

const ffmpeg = createFFmpegCore({
    corePath: 'ffmpeg-core.js',
    mainName: 'main'
});

async function applySlowedReverb(inputFile, slowPercentage, reverbPercentage) {
    await ffmpeg.load();
    await ffmpeg.write('input.mp3', inputFile);
    const slow = 1 + (slowPercentage / 100);
    const reverb = reverbPercentage / 100;
    const command = `-i input.mp3 -filter_complex "[0:a]atempo=${slow}, areverse, aresample=async=1, areverse, aeval=val(0)|val(1)*${reverb}:c=same" song_s+r.mp3`;
    await ffmpeg.run(...command.split(' '));
    const data = ffmpeg.read('song_s+r.mp3');
}

downloadButton.addEventListener('click', () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));
    downloadLink.download = 'song_s+r.mp3';
    downloadLink.click();
});