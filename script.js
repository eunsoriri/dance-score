// link from Teachable Machine export
const URL = "https://teachablemachine.withgoogle.com/models/ummg60T8z/";
let model, video, ctx, labelContainer, maxPredictions;
const threshold = 0.6;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    labelContainer = document.getElementById("label-container");
    window.requestAnimationFrame(loop);
}

async function loop() {
    ctx.drawImage(video, 0, 0, 200, 200);
    const { pose, posenetOutput } = await model.estimatePose(video);
    const prediction = await model.predict(posenetOutput);

    // find highest probability
    let best = prediction.reduce((a, b) => (a.probability > b.probability ? a : b));
    // show if above threshold
    if (best.probability > threshold) {
        labelContainer.innerText = best.className + ": " + best.probability.toFixed(2);
    } else {
        labelContainer.innerText = "";
    }

    if (pose) {
        tmPose.drawKeypoints(pose.keypoints, 0.5, ctx);
        tmPose.drawSkeleton(pose.keypoints, 0.5, ctx);
    }

    window.requestAnimationFrame(loop);
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('header').innerText = "나처럼 해봐요";
    init();
});
