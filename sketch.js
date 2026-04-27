// Hand Pose Detection with ml5.js

let video;
let handPose;
let hands = [];

function preload() {
  // 初始化 HandPose 模型
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 使用全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 開始偵測手勢
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 設定畫布背景顏色
  background('#add8e6');

  // 計算顯示影像的寬高 (全螢幕的 50%)
  let vw = width * 0.5;
  let vh = height * 0.5;
  // 計算置中座標
  let vx = (width - vw) / 2;
  let vy = (height - vh) / 2;

  // 繪製影像在視窗中間
  image(video, vx, vy, vw, vh);

  // 確保有偵測到手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 設定連線區邊
        let fingerLines = [
          [0, 1, 2, 3, 4],    // 大拇指
          [5, 6, 7, 8],       // 食指
          [9, 10, 11, 12],    // 中指
          [13, 14, 15, 16],   // 無名指
          [17, 18, 19, 20]    // 小指
        ];

        // 繪製手指連線
        stroke(hand.handedness === "Left" ? color(255, 0, 255) : color(255, 255, 0));
        strokeWeight(2);
        noFill();
        for (let points of fingerLines) {
          for (let i = 0; i < points.length - 1; i++) {
            let p1 = hand.keypoints[points[i]];
            let p2 = hand.keypoints[points[i+1]];
            line(map(p1.x, 0, video.width, vx, vx + vw), map(p1.y, 0, video.height, vy, vy + vh),
                 map(p2.x, 0, video.width, vx, vx + vw), map(p2.y, 0, video.height, vy, vy + vh));
          }
        }

        // 繪製關鍵點小圓圈
        noStroke();
        fill(hand.handedness === "Left" ? color(255, 0, 255) : color(255, 255, 0));
        for (let keypoint of hand.keypoints) {
          circle(map(keypoint.x, 0, video.width, vx, vx + vw), map(keypoint.y, 0, video.height, vy, vy + vh), 10);
        }
      }
    }
  }

  // 在整個畫布中間加上文字
  fill(0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("414730266留妍瑜", width / 2, height / 2);
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
