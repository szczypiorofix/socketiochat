$(document).ready(function (){
    
        var canvas = document.getElementById('c'),
            context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
        function Point(x,y,distance){
            this.x = x;
            this.y = y;
            this.distance = distance;
            this.radius = 3*distance;
            this.velocity = distance*(1+Math.random());
    
            this.opacity = 1 - this.distance/5;
    
            return this;
        }
    
        Point.prototype.draw = function (){
            var _radgrad = context.createRadialGradient(this.x,this.y,0,this.x,this.y,this.radius);
            _radgrad.addColorStop(0, 'rgba(250,250,250,' + this.opacity + ')');
            _radgrad.addColorStop(0.1, 'rgba(250,250,250,' + this.opacity + ')');
            _radgrad.addColorStop(1, 'rgba(250,250,250,0)');
    
            context.fillStyle = _radgrad;
            context.beginPath();
            context.arc(this.x,this.y,this.radius,0,2*Math.PI);
            context.closePath();
            context.fill();
        };
    
        var points = [],
            sizeX = canvas.width,
            sizeY = canvas.height,
            gravity = 0.3;
    
        var loop = function loop(data){
            clearCanvas();
            var pointsArray = [];
    
            for (var j=0; j < points.length; j++) {
                var point = points[j];
    
                if (point.y + point.velocity < sizeY + 20) {
                    point.draw();
                    point.y += point.velocity*gravity;
                    pointsArray.push(point);
                } else {
                    var p = new Point(Math.random()*sizeX, -20, point.distance);
                    pointsArray.push(p);
                }
            }
    
            points = pointsArray;
    
            if (points.length) {
                requestAnimationFrame(loop);
            }
        };
    
        for (var k=0; k < 70; k++) {
            var p_big = new Point(Math.random()*sizeX, Math.random()*sizeY, 7 + Math.random()*3);
            points.push(p_big);
    
            var p_small = new Point(Math.random()*sizeX, Math.random()*sizeY, Math.random()*3);
            points.push(p_small);
    
            var p_tiny = new Point(Math.random()*sizeX, Math.random()*sizeY, Math.random()*3);
            points.push(p_tiny);
        }
    
        requestAnimationFrame(loop);
    
        var clearCanvas = function clearCanvas(){
            context.clearRect(0,0,sizeX,sizeY);
        }
    });