    canvas = document.getElementById("main");
    canvas.width = window.innerWidth - 20; //expand canvas
    canvas.height = window.innerHeight - 20; //expand canvas

    ///////////////////////////////////////////////////////////////////////////
    //vars
    var minPoints = 5;
    var maxPoints = 10;
    var lineWidth = 10;
    var circleRad = 10;
    var pointDist = 30;
    var maxSideLines = 2;
    var text = true;
    ///////////////////////////////////////////////////////////////////////////

    pointArray = [];
    lines = [];

    //draws
    drawPattern = function() {
      //decide on the number of points & edgeLines
      var numPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
      var edgeLines = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;

      //generate the points
      for (var i = 0; i < numPoints; i++) {
        var randX;
        var randY;
        var testPoint;
        //ensures points are away from each other
        do {
          randX = Math.floor(Math.random() * (canvas.width - 199)) + 100;
          randY = Math.floor(Math.random() * (canvas.height - 199)) + 100;
          testPoint = new Point(randX, randY);
        } while (!pointArray.every(function(a) {
            return testPoint.getDistance(a) > pointDist
          }));
        pointArray.push(testPoint);
      }

      //sorts the array by closest distance to 1st node
      //pointArray = pointArray.sort(function(a,b){return pointArray[0].getDistance(a) - pointArray[0].getDistance(b)});

      //generates every line that doesn't intersect a previous line
      for (var i = 0; i < pointArray.length - 1; i++) {
        for (var j = i + 1; j < pointArray.length; j++) {
          if (!wouldIntersect(pointArray[i], pointArray[j]) && i != j) {
            lines.push([i, j]);
          };
        };
      };
      console.log(lines);


      var lineCount = [];
      for (x in pointArray) {
        lineCount.push(0);
      }

      //render the paths, except the more paths a node has the less chance of more
      var paths = [];
      for (var i = 0; i < lines.length; i++) {
        if (lineCount[lines[i][0]] < 2 || lineCount[lines[i][1]] < 2 || Math.random() <0.5+ (0.5 / ((lineCount[lines[i][0]] + lineCount[lines[i][1]]) / 3))) {
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

      //off-screen nodes
      //sideID = which side of the screen it goes off

      var sideID = 0;
      for (var i = 0; i < edgeLines; i++) {
        var coord;

        if (sideID % 2 == 0) {
          coord = Math.floor(Math.random() * (canvas.width + 1));
        } else {
          coord = Math.floor(Math.random() * (canvas.height + 1));
        }

        var sidePoint;
        if (sideID == 0) {
          sidePoint = new Point(coord, 0);
        } else if (sideID == 1) {
          sidePoint = new Point(0, coord);
        } else if (sideID == 2) {
          sidePoint = new Point(coord, canvas.height);
        } else {
          sidePoint = new Point(canvas.width, coord);
        }
        var connection = pointArray.filter(function(a) {
          return !wouldIntersect(sidePoint, a);
        }).sort(function(a, b) {
          return sidePoint.getDistance(a) - sidePoint.getDistance(b);
        })[0];
        newLine = new Path.Line(sidePoint, connection);
        newLine.style = {
          strokeColor: 'black',
          strokeWidth: lineWidth,
          strokeCap: 'round'
        };

        paths.push(newLine);
        sideID++
        if (sideID > 3) {
          sideID = 0
        }

      }

      //renders the pointArray as circles
      var circles = pointArray.map(function(a) {
        var newCirc = new Path.Circle(a, circleRad);
        newCirc.strokeColor = 'black';
        newCirc.fillColor = new Color(0, 0, 0)
        return newCirc;
      });

      //node ID on nodes
      if (text) {
        var texts = [];
        for (var i = 0; i < pointArray.length; i++) {
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
    };

    wouldIntersect = function(p, q) {
      return lines.filter(function(a) {
        return !p.equals(pointArray[a[1]]);
      }).some(function(a) {
        return intersect(p, q, pointArray[a[0]], pointArray[a[1]]);
      });
    }

    orient = function(p, q, r) {
      return (r.y - p.y) * (q.x - p.x) > (q.y - p.y) * (r.x - p.x);
    }
    intersect = function(p1, p2, q1, q2) {
      return orient(p1, q1, q2) != orient(p2, q1, q2) && orient(p1, p2, q1) != orient(p1, p2, q2);
    }

    drawPattern();
