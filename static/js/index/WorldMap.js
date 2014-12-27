/**
 * @fileOverview Represents a world map object.
 * @author Cristian Sima
 * @version 30.12.2014
 */



/**
 * It represents a WorldMap object. It extends the XantenMap object
 * @constructor
 * @extends XantenMap
 * @param array The array of the map
*/
function WorldMap(obj){
	
	var WorldMap	 		= new XantenMap(obj.array, 'world');
	WorldMap.__proto__ 		= "WorldMap";
	WorldMap.players		= obj.players;
	WorldMap.backgrounds	= obj.backgrounds;
	
	/**
	 * 
	 * @memberOf WorldMap.prototype 
	 * @param x The x coordinate
	 * @param y The y coordinate
	 */
	WorldMap.selectCell = function(x, y){
		
		this.deselect();
		
		var id_selected_city = this.getCityByPosition(x, y);
		if(id_selected_city){
			if(id_selected_city !== game.player.id){
				game.performAction("selectCity", id_selected_city);
			} else {
				game.performAction("city-map-selected");
			}
			this.selectImage(x, y);
		} else {
			game.performAction('clear', null);
		}
		
		// alert('You hit the square '+x+' '+y+ ' from world map. This map has no selectCell method yet')
		// TODO waiting for python team
	};

	/**
	 * It renders the information of the array into Graphical form
	 * @memberOf WorldMap.prototype 
	 */
	WorldMap.render = function(){
		for(i=1; i <= this.array.length; i++){
			for(j=1; j <= this.array.length; j++){
				var cell 		= $(this.HTML_element + " #cel_"+i+"_"+j),
					array_bg	= this.array[(i-1)][(j-1)],
					background 	= this.backgrounds[array_bg.id_background];
				
				cell.removeClass();
				
				if(background.allowCity && array_bg.id_city) {	
					cell.addClass("allow_city");	
					var player 	= this.getCityById(array_bg.id_city);
					cell.html(HTML_Engine.getBuilding.image("administration", player.level, 98) + "<span class='level'>" + player.level + "</span>" + "<span class='description'>"+player.name.capitalize()+"</span>");
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").addClass('hasAction');	
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": player});	
				} 			
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/background/world/' + background.img + ')');
			}
		}		
		// this.renderTrades();
		// this.renderAttacks();
	};
	
	/**
	 * It renders the trades
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.renderTrades = function(){	
		// TODO
	}
	
	/**
	 * It renders the attacks
	 * @memberOf WorldMap.prototype 
	 */
	WorldMap.renderAttacks = function() {
		for(move in this.data.militaryMovements){
			var move_obj = this.data.militaryMovements[move];
			this._addPath(move_obj.path, "military", HTML_Engine.worldPath.moveMilitaryUnits(move_obj.from, move_obj.to, move_obj.resources),
					move_obj.resources.time * 90,
					undefined
			);
		}			
	};
	
	/**
	 * It draws the canvas
	 * @private
	 */
	WorldMap._drawCanvas = function(){
		var instance = this;
		createjs.Ticker.addEventListener("tick", tick);		
		function tick(event) {
		    instance.canvas.stage.update();
		}
	}
	
	/**
	 * It adds a new path
	 * @param {array} path A 2d array with the path
	 * @param {string} type It can be 'attack' or 'trade'
	 * @param {string} description The description for the path
	 * @param {number} duration The duration in ms
	 * @param {function} callBack A function to be called when the path is removed
	 * @private
	 */
	WorldMap._addPath = function (path, type, description, duration, callBack){
			
		if(!this.canvas.paths.length){
			this._drawCanvas();
		}
		
		var id 							= Object.keys(this.canvas.paths).length
			instance 					= this, //make the variables global, so you can access them in the animation function
			ido 						= "path_"+(parseInt(id) + 0),
			instance.canvas.paths[ido]	= {},
			currentPath					= this.canvas.paths[ido],
			currentPath.duration		= duration,
			currentPath.id				= ido,
			pixel						= 100,
			startX						= path[0][0] * pixel + 50,
			startY						= path[0][1] * pixel + 50,
			lines						= [startX, startY],
			x							= startX,
			y							= startY;;
			
		if(path.length%2 === 0){
			lines.push(startX);
			lines.push(startY);
		}
			
		var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 2);
			circle.x = startX;
			circle.y = startY;
		
		var line = new createjs.Shape();
			line.graphics.setStrokeStyle(3);
			line.graphics.beginStroke("#A7ACA6");
			line.graphics.moveTo(startX, startY);
			
		for (var i = 1; i <= path.length - 1; i++) {
			

			var zx = path[i][0];
			var zy = path[i][1];

			var small_line = [zx * pixel + 50, zy * pixel + 50];
			
			lines.push(small_line[0]);
			lines.push(small_line[1]);
			line.graphics.lineTo(small_line[0], small_line[1]);
			

			x = path[i][0];
			y = path[i][1];
		}
		
				
		line.graphics.endStroke();
		
		var end = (function(){
			var v = ido;
			if(callBack){
				var c = callBack;
			}
			return function(){instance.removePath(v); if(c) {c();} };
		})();
		
		createjs.Tween.
				get(circle).
				to({guide:{ path:lines}},duration).
				call(end);
		
	    
		this.canvas.stage.addChild(line);
		this.canvas.stage.addChild(circle);

		
		this.canvas.stage.update();
		
		currentPath.line 	= line;
		currentPath.circle 	= circle;     
	};
	
	/**
	 * It removes the path
	 * @param {number} id The id of the path (eg. path_0)
	 * @private 
	 */
	WorldMap.removePath = function(id){
		var p =game.worldMap.canvas.paths[id];
		p.circle.removeAllEventListeners();
		this.canvas.stage.removeChild(p.line)		
		this.canvas.stage.removeChild(p.circle)		
		this.canvas.stage.update();
		delete this.canvas.paths[id];		
		if(!this.canvas.paths.length){
			createjs.Ticker.removeAllEventListeners();
		}
	};
 
 	/** 
 	 * It returns the city using the id
 	 * @param id The id of the city
	 * @return (object) An object with information regarding the city
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityById = function(id){
		return this.players[id];
	};
	
	/**
	 * It returns the id of the city based on the position on the world map
	 * @param (number) x The x position
	 * @param (number) y The y position
	 * @return (number) The id of the city or null if nothing is there
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityByPosition = function(x, y){
		return this.array[(x-1)][(y-1)].id_city;
	};
	
	/**
	 * It returns the position of a city on the map
	 * @param (number) id The id of the city
	 * @return (object) An object with the x and y position
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityPositionById = function(id){
		for(i=0; i<=this.array.length-1; i++){
			for(j=0; j<=this.array.length-1; j++){
				if(array[i][j].id_city === id){
					return {
						"x" : i,
						"y" : j
					}
				}
			}
		}
	};
	
	/**
	 *  It creates the canvas and installs the motionGuidePlugin
	 *	@memberOf WorldMap.prototype
	 */
	WorldMap._init = function(){
		var instance = this;
		this.canvas = {};		
		this.canvas.stage = new createjs.Stage("canvas");
		this.canvas.paths = {};
			
		createjs.MotionGuidePlugin.install();
		
	};
	
	/**
	 * It deletes all the paths and stops the ticker listener
	 * @memberOf WorldMap.prototype
	 */
	WorldMap._freeze = function(){
		for(path in this.canvas.paths){
			this.removePath(this.canvas.paths[path].id);
		}
		createjs.Ticker.removeAllEventListeners();
	}
	
	/**
	 * It shows the canvas and it starts the ticker if there are any paths
	 * @memberOf WorldMap.prototype
	 */
	WorldMap._select = function(){
		$("#canvas").show();
		if(this.canvas.paths.length){
			this._drawCanvas();
		}
	}
	
	/**
	 * It hides the canvas and it removes the listener ticker
	 * @memberOf WorldMap.prototype
	 */
	WorldMap._hide = function(){
		$("#canvas").hide();
		createjs.Ticker.removeAllEventListeners();
	}
	
	return WorldMap;
 }