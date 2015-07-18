function tournament(competitor, uplength, person, ulid, canvasid) {
  var 
    pow2Competitor, matches, seedCompetitors,
    versus, tournamentRound,
    tournamentRound, roundMatches, nextRoundMatches,
    lineStartPosition = new Array(0),
    canvas = document.getElementById(canvasid),
    ctx = canvas.getContext("2d"),
    ul = document.getElementById(ulid);
  
  // 「n-1<トーナメント参加者数<n」となる、「n=2^m」のnとmを求める
  pow2Competitor = 1;
  matches = 0;
  for (var i = competitor; i > 1; i /= 2){
    pow2Competitor *= 2;
    matches++;
  }
  
  // トーナメント参加者（左側ul要素内）を表示
  for (var i = 0; i < pow2Competitor; i++) {
    if (person[i][0]) {
      var li = document.createElement('li');
      li.innerHTML = person[i][0];
      ul.appendChild(li);
    }
  }
  
  // 参加者名から伸びる最初の線のy座標を配列に格納
  seedCompetitors = 0
  for (var i = 0; i < pow2Competitor; i++) {
    if (person[i][0]) {
      lineStartPosition.push(16 + (i - seedCompetitors) * 20);
    } else {
      lineStartPosition.push(0);
      seedCompetitors++;
    }
  }
  
  
  // 表示に必要なキャンバスの大きさを計算し、格納
  canvas.width  = (matches + 1) * uplength;
  canvas.height = competitor * 20;
  
  
  // トーナメント表の線、黒色部分を生成
  versus = 0;
  tournamentRound = 0;
  for (var i = pow2Competitor; i > 1; i /= 2) { // 1回戦、2回戦、3回戦……etc
    for (var j = 0; j < i; j += 2) { // n回戦第1試合、n回線第2試合、n回線第3試合……etc
      if (lineStartPosition[versus] && lineStartPosition[versus + 1]) {
        lineStartPosition.push(tournamentline(uplength * tournamentRound, lineStartPosition[versus], uplength * tournamentRound, lineStartPosition[versus + 1]));
      } else {
        if (lineStartPosition[versus]) {
          lineStartPosition.push(tournamentseed(uplength * tournamentRound, lineStartPosition[versus]));
        } else if (lineStartPosition[versus + 1]) {
          lineStartPosition.push(tournamentseed(uplength * tournamentRound, lineStartPosition[versus + 1]));
        } else {
          lineStartPosition.push(0);
        }
      }
      versus += 2;
    }
    tournamentRound++;
  }
  tournamentlast(uplength * tournamentRound, lineStartPosition[versus]);
  
  
  //トーナメント表の線、赤色部分を生成
  for (var i = 0; i < pow2Competitor; i++) {
    if (person[i][1]) {
      tournamentRound = 1;
      roundMatches = pow2Competitor;
      nextRoundMatches = pow2Competitor / 2;
      for (var j = 0; j < person[i][1]; j++) {
        if (j === 0) {
          tournamentwinone(lineStartPosition[i], lineStartPosition[roundMatches + Math.floor(i / 2)]);
        } else {
          tournamentwin((j + 1) * uplength, lineStartPosition[roundMatches + Math.floor(i / tournamentRound)], lineStartPosition[(roundMatches + nextRoundMatches) + Math.floor(i / (tournamentRound * 2))]);
          roundMatches += nextRoundMatches;
          nextRoundMatches /= 2;
        }
        tournamentRound *= 2;
      }
    }
  }
  
  // トーナメント表、黒色部分のを生成する関数、シード
  function tournamentseed(px, py) {
    var xlength = px + uplength;

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.moveTo(px, py);
    ctx.lineTo(xlength, py);
    ctx.stroke();

    return py;
  }
  
  // トーナメント表、黒色部分を生成する関数、通常
  function tournamentline(p1x, p1y, p2x, p2y) {
    var xlength = (p1x > p2x) ? p1x + uplength : p2x + uplength;

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(xlength, p1y);
    ctx.lineTo(xlength, p2y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    return (p1y + p2y) / 2;
  }
  
  // トーナメント表、黒色部分を生成する関数、決勝
  function tournamentlast(finishx, finishy) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.moveTo(finishx, finishy);
    ctx.lineTo(finishx + uplength / 2, finishy);
    ctx.stroke();
  }
  
  // トーナメント表、赤色部分を生成する関数、1回戦
  function tournamentwinone(starty, finishy) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.moveTo(0, starty);
    ctx.lineTo(uplength, starty);
    ctx.lineTo(uplength, finishy);
    ctx.lineTo(uplength * 2, finishy);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // トーナメント表、赤色部分を生成する関数、通常
  function tournamentwin(startx, starty, finishy) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.moveTo(startx, starty);
    ctx.lineTo(startx, finishy);
    ctx.lineTo(startx + uplength, finishy);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
