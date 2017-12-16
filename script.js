//ce qui s'affiche lors du démarage de la page

window.onload = function(){
    var canvaswidth = 900;
    var canvasheight = 600;
    var ctx;
    var blockSize = 30;
    var delay = 100;
    var snaky;
    var apple;
    var colliwidth=canvaswidth/blockSize;
    var colliheight=canvasheight/blockSize;
    var score ;
    var timeout;
    
    init();
    
    function init(){
        score = 0 ;
    // créer un canvas dans la page
        var canvas=document.createElement('canvas');
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        canvas.style.border = "20px solid";
        canvas.style.margin = "auto auto";
        canvas.style.display = "block";
        canvas.style.background = "url('snake.jpeg') center";
        document.body.appendChild(canvas);
    
    //pour dessiner dans la page
        ctx=canvas.getContext('2d');
    // initialiser le serpent
        snaky = new snake([[6,4] , [5,4] , [4,4]],"right");
    // initialiser la pomme
        apple = new pomme([9,4]);
        refresh();
    
    }
    
    //dessoner le score
    function drawscore(){
        ctx.save();
        ctx.font ="bold 200px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(),(canvaswidth/2),(canvasheight/2));
        ctx.restore();
    }
    
    // to play again
    function restar(){
        snaky = new snake([[8,4] , [7,4] , [6,4]],"right");
        apple = new pomme([9,10]);
        score = 0 ;
        clearTimeout(timeout);
        refresh();
    }
    
    // répeter les fonctions par rappot un delay
    function refresh(){   
        snaky.advance();    
        if(snaky.checkColision()){
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle ="#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText("GAME OVER",(canvaswidth/2),(canvasheight/2)-170);
            ctx.fillText("GAME OVER",(canvaswidth/2),(canvasheight/2)-170);
            
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("PRESS 'espace' TO PLAY AGAIN",(canvaswidth/2),(canvasheight/2)-40);
            ctx.fillText("PRESS 'espace' TO PLAY AGAIN",(canvaswidth/2),(canvasheight/2)-40);
            ctx.restore();
        } else{
            if(snaky.eatingapple(apple)){
                    score = score + 1;
                    snaky.ateapple = true;
                    do{
                        apple.setnewposition();
                    }while(apple.isonsnake(snaky))
                }
            ctx.clearRect(0 , 0 , canvaswidth , canvasheight);
            drawscore();
            snaky.draw();
            apple.draw();
            timeout = setTimeout(refresh,delay);
        }
    }
    
    function drawBlock(ctx , position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x , y , blockSize , blockSize);
    }
    
    //créer objjet snake
    function snake(body , direction){
        this.body = body;
        this.direction = direction;
        this.ateapple = false;
        // dessiner le serpent
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#454";
            for(var i=0; i<this.body.length; i++){
                drawBlock(ctx , this.body[i]);
            }
            ctx.restore();
        };
        // faire avancer le serpent
        this.advance = function(){
            var nextposition = this.body[0].slice();
            
            // diriger le serpent
            switch(this.direction){
                case "left":  nextposition[0] -= 1;
                       break;
                case "right": nextposition[0] += 1;
                       break;
                case "up":    nextposition[1] -= 1;
                       break;
                case "down":  nextposition[1] += 1;
                       break;
                default: throw("erreur");
            }
            this.body.unshift(nextposition);
            if(!this.ateapple){
                this.body.pop();
            } else
                this.ateapple = false;
        };
        
        //conditionner les directions
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":  
                case "right": allowedDirection = ["up","down"];
                    break;
                case "up": 
                case "down":  allowedDirection = ["right","left"];
                    break;
                default: throw("erreur");
            }
            if(allowedDirection.indexOf(newDirection) > -1 ){
                this.direction = newDirection;
            }
        };
        
        // savoir si le serpent frappe au ordure où frappe à soit même
        this.checkColision = function(){
            var collision = false;
            var snakecollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            if( ((head[0] > colliwidth-1) || (head[0] < 0)) || ((head[1] > colliheight-1) || (head[1] < 0)) ){
                    collision = true;
               }
            for(var i = 0; i < rest.length ; i++){
                    if((head[0]===rest[i][0]) && (head[1]===rest[i][1])){
                            snakecollision = true;
                        }
                }
            return collision || snakecollision ;
                
        };
        
        //savoir si le serpent a mangé la pomme
        this.eatingapple = function(Apple){
            var head = this.body[0];
            if(head[0]===Apple.position[0] && head[1]===Apple.position[1])
                return true;
            else
                return false;
        };
        
    }
    
    //créer la pomme
    
    function pomme(position){
        this.position = position;
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#f54";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]* blockSize + radius;
            var y = this.position[1]* blockSize + radius;
            ctx.arc(x , y , radius , 0 , Math.PI*2 , true);
            ctx.fill();
            ctx.restore();
        };
        this.setnewposition = function(){
            this.position =[Math.round(Math.random()*(colliwidth-1)) , Math.round(Math.random()*(colliheight-1))];
        };
        this.isonsnake = function(SNAKE){
            var isonsnake = false;
            for(i=0 ; i < SNAKE.body.length ; i++){
                    if(this.position[0]===SNAKE.body[i][0] && this.position[1]===SNAKE.body[i][1]){
                           isonsnake = true; 
                        }
                }
            return isonsnake;
        };
    }
    
    // recevoir le code du button cliqué
    document.onkeydown = function key(e){
        var k = e.keyCode;
        var newDirection;
        
        switch(k){
            case 37: newDirection = "left";
                break;
            case 38: newDirection = "up";
                break;
            case 39: newDirection = "right";
                break;
            case 40: newDirection = "down";
                break;
            case 32: restar();
                return;
            default: return ;
        }
        snaky.setDirection(newDirection);
    }
    
    
    
    
    
   
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}