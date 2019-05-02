    canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth - 20; //document.width is obsolete
    canvas.height = window.innerHeight - 20; //document.height is obsolete

    var minPoints = 5;
    var maxPoints = 10;
    var lineWidth = 10;
    var circleRad = 10;
    var pointDist = 30;
    pointArray = [];
    lines = [];
    drawGrid = function() {

    var numPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
    var edgeLines = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
    //console.log(numPoints);

    //// DEBUG:
    /*pointArray.push(new Point(477, 200));
    pointArray.push(new Point(728, 770));
    pointArray.push(new Point(741, 651));
    pointArray.push(new Point(750, 560));
    pointArray.push(new Point(596, 568));
    /*pointArray.push(new Point(970, 438));
    pointArray.push(new Point(472, 359));
    pointArray.push(new Point(866, 14));
    pointArray.push(new Point(216, 130));*/

    var texts = [];
    var paths = [];

    for (var i=0; i<numPoints; i++) {
      var randX;
      var randY;
      var testPoint;
      do {
        randX = Math.floor(Math.random() * (canvas.width - 199)) + 100;
        randY = Math.floor(Math.random() * (canvas.height - 199)) + 100;
        testPoint = new Point(randX, randY);
      } while (!pointArray.every(function(a){return testPoint.getDistance(a) > pointDist}));
      pointArray.push(testPoint);
    }

    //pointArray = pointArray.sort(function(a,b){return pointArray[0].getDistance(a) - pointArray[0].getDistance(b)});

    var circles = pointArray.map(function(a){
      var newCirc = new Path.Circle(a, circleRad);
      newCirc.strokeColor = 'black';
      newCirc.fillColor = new Color(0, 0, 0)
      return newCirc;
    });

    /*for (var i=0; i<minPoints; i++) {
      var startPoint;
      var endPoint;
      do {
        var uStartPoint = Math.floor(Math.random() * (pointArray.length));
        var uEndPoint = Math.floor(Math.random() * (pointArray.length));
        startPoint = Math.min(uStartPoint, uEndPoint);
        endPoint = Math.max(uStartPoint, uEndPoint)
      } while (startPoint == endPoint || lines.some(function(a){
        return (startPoint == a[0] && endPoint == a[1]);
      })|| lines.some(function(a){
        return intersect(pointArray[startPoint], pointArray[endPoint], pointArray[a[0]], pointArray[a[1]])
      }));
      lines.push([startPoint, endPoint]);
    }*/

    for (var i=0; i<pointArray.length - 1; i++) {
      for (var j=i+1; j<pointArray.length; j++) {
        /*var intersects = false;
        console.log(i + ", " + j);
        for (var k=0; k<lines.length; k++) {
            if (i != lines[k][1]) {
              console.log("   " + lines[k][0] + ", " + lines[k][1]);
              if (intersect(pointArray[i], pointArray[j], pointArray[lines[k][0]], pointArray[lines[k][1]])) {
                intersects = true;
                console.log("      intersects");
                //console.log("line " + i + ", " + j + " intersects with " + lines[k][0] + ", " + lines[k][1]);
              }else{console.log("      doesn't intersect")};
            }
        }*/
        if (!wouldIntersect(pointArray[i],pointArray[j]) && i != j) {
          lines.push([i,j]);
        }//else {console.log("failed for " + i + ", " + j)}
      }
    }
    console.log(lines);

    var lineCount = [];

    for (x in lines) {
      lineCount.push(0);
    }

    for (var i=0; i<lines.length; i++) {
      if (lineCount[lines[i][0]] < 2 || lineCount[lines[i][1]] < 2 || Math.random() < 1/((lineCount[lines[i][0]] + lineCount[lines[i][1]])/5)) {
        newLine = new Path.Line(pointArray[lines[i][0]], pointArray[lines[i][1]])
        newLine.style = {
          strokeColor: 'black',
          strokeWidth: lineWidth,
          strokeCap: 'round'
        };
        paths.push(newLine);
        lineCount[lines[i][0]]++;
        lineCount[lines[i][1]]++;
      }
    }
    var sideID = 0;
    for (var i=0; i<edgeLines; i++) {
      var coord;
      if (sideID % 2 == 0) {
        coord = Math.floor(Math.random() * (canvas.width +1));
      }else {
        coord = Math.floor(Math.random() * (canvas.height +1));
      }
      var sidePoint;
      if (sideID == 0) {
        sidePoint = new Point(coord, 0);
      }else if (sideID == 1) {
        sidePoint = new Point(0, coord);
      }else if (sideID == 2) {
        sidePoint = new Point(coord, canvas.height);
      }else {
        sidePoint = new Point(canvas.width, coord);
      }
      connection = pointArray.filter(function(a){
        return !wouldIntersect(sidePoint,a);
      }).sort(function(a,b){return sidePoint.getDistance(a) - sidePoint.getDistance(b)})[0]
      newLine = new Path.Line(sidePoint, connection)
      newLine.style = {
        strokeColor: 'black',
        strokeWidth: lineWidth,
        strokeCap: 'round'
      };
      paths.push(newLine);
      sideID++
      if (sideID > 3) {sideID = 0}
    }

  	// Move to start and draw a line from there
  	//path.moveTo(start);
  	// Note the plus operator on Point objects.
  	// PaperScript does that for us, and much more!
  	//path.lineTo(start + [ 100, -50 ]);

    for (var i=0; i<pointArray.length; i++) {
      var newText = new PointText(pointArray[i] + [0, 5]);
      newText.content = i;
      newText.style = {
        fontFamily: 'Courier New',
        fontWeight: 'bold',
        fontSize: 20,
        fillColor: 'white',
        justification: 'center'
      };
      texts.push(newText);
    }
  }

  wouldIntersect = function(p, q) {
    return lines.filter(function(a){
      return !p.equals(pointArray[a[1]]);
    }).some(function(a){
      return intersect(p, q, pointArray[a[0]], pointArray[a[1]]);
    });
  }

  /*var onSegment = function(p, q, r) {
    return (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
  }

  var orientation = function(p, q, r) {
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    var val = (q.x - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0; // colinear
    return (val > 0)? 1 : 2; // clock or counterclock wise
  }

  doIntersect = function(p1, p2, q1, q2) {
    // Find the four orientations needed for general and
    // special cases
    var o1 = orientation(p1, q1, p2);
    var o2 = orientation(p1, q1, q2);
    var o3 = orientation(p2, q2, p1);
    var o4 = orientation(p2, q2, q1);
    if (o1 != o2 && o3 != o4) {return true;}

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) {return true};
    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) {return true};
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) {return true};
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) {return true};
    return false; // Doesn't fall in any of the above cases
  }*/

  orient = function(p, q, r) {
    return (r.y-p.y) * (q.x-p.x) > (q.y-p.y) * (r.x-p.x);
  }
  intersect = function(p1, p2, q1, q2) {
    return orient(p1, q1, q2) != orient(p2, q1, q2) && orient(p1, p2, q1) != orient(p1, p2, q2);
  }

drawGrid();
