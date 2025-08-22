// **** ミサイル用のプログラムを定義 ****
var missile = function(controller) {
  // 相手が左側にいるか判定する
  // （左90度の角度から、180度の範囲に敵が居るか判定）
  if(controller.scanEnemy(90, 150)) {
    // 左側にいる場合は、左へ回転
    controller.turnLeft();
    controller.speedDown();
  } else {
    // それ以外は、右へ回転
    controller.turnRight();
    controller.speedDown();
  }
  // 今向いている方向へ、加速する
  controller.speedUp();
};

// **** 本体用のプログラムを定義 ****
var bot = function(controller) {
  // 前方からの攻撃を避ける
  //  （敵の攻撃が 前方0度 の角度から
  //  60度の範囲、距離60 以内にあるか判定）
  if (controller.scanAttack(0, 60, 100)) {
    // 後退しながら、高度を下げる
    controller.back();
    controller.descent();
    return;
  }

  // 自機の高度が高さ 100 以下になっていた場合
  if (controller.altitude() < 150) {
    // 高度を上げる
    controller.ascent();
    return;
  }
  
  // 敵が後方に居た場合 (前方180度内に居なかった場合)
  if (!controller.scanEnemy(0, 180)) {
    // 現在向いている方向と逆方向を向く
    
    controller.turn();
    return;
  }
  
  if  (controller.missileAmmo()===0) {
    controller.turn();
    controller.ahead();
    if(controller.temperature() < 80){
      controller.fireLaser(-10, 8);
      controller.descent();
      return;
    }
    if(controller.frame() % 64 === 0){
      controller.ascent();
      return;
    }
   return;
  }
  // 敵が前方近くに居た場合、攻撃する
  // 向き 0度、幅 30度, 距離 200の居たら攻撃する
  if (controller.scanEnemy(0, 30)) {
    controller.scanDebug(0, 30);
    // 機体の温度が高い場合は、攻撃しない
    if (80 < controller.temperature()) {
      return;
    }

    // 5フレームに一度、ミサイルを発射する
    if (controller.frame() % 1 === 0) {
      // ミサイル用プログラムを使用し、ミサイルを発射する
      controller.fireMissile(missile);
    } else {
      // 前方（0度）へ向けて 強さ8で レーザーを発射する
      controller.fireLaser(-10, 8);
    }
    return;
  }

  // 敵が前方の遠い位置に居た場合、前進する
  if (controller.scanEnemy(0, 30)) {
    controller.ahead();
    return;
  }
};

return bot;