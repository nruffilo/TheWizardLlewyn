var world = {};
var personHeight = 64;
var personWidth = 42;
var collectableCount = 0;
var hero_top = 120;
var hero_left = 20;
var hero_velocity_x = 0;
var hero_velocity_y = 0;
var black_holes = [];
var max_black_holes = 0;
var hero_height = 64;
var hero_width = 42;
var black_holes_used = 0;
var game_active = false;
var sensitivity = 100; //higher numbers, slower game
var black_hole_weight = 10;
$(document).ready(function() {

    $(document).click(function(event) {
        if (game_active) {
            //remove old black holes, create new black hole
            black_holes_used++;
            if (black_holes.length == max_black_holes) {
                black_hole_to_remove = black_holes.shift();
                black_hole_to_remove.el.remove();
            }

            var el = $("<div class='black_hole'></div>");
            $("#gameboard").append(el);

            el.css("top", event.pageY + "px");
            el.css("left", event.pageX + "px");
            black_holes.push({el: el, top: event.pageY, left: event.pageX, mass:50, height: 12, width: 12});
        }
    });

    world.people = [];
    world.collectables = [];
    world.obstacles = [];

    //setStage(1);

});


function moveHero() {
    var moveX = 0;
    var moveY = 0;

    //need to be additive for multiple black holes
    for (i in black_holes) {
        if (typeof(black_holes[i]) != "undefined") {
            var total_distance = Math.sqrt(Math.abs(hero_top-black_holes[i].top)^2+Math.abs(hero_left-black_holes[i].left)^2);
            var amplification_effect = (1/((total_distance+10)^2));
            var yVelocity = (black_holes[i].mass) * amplification_effect;
            var xVelocity = (black_holes[i].mass) * amplification_effect;
            if (black_holes[i].top + (black_holes[i].height/2) > hero_top + (hero_height/2)) {
                yVelocity = Math.abs(yVelocity);
            } else {
                yVelocity = -Math.abs(yVelocity);
            }

            if (black_holes[i].left + (black_holes[i].width/2) > hero_left + (hero_width/2)) {
                xVelocity = Math.abs(xVelocity);
            } else {
                xVelocity = -Math.abs(xVelocity);
            }


            //TODO: Update velocity to approproiately deal with sign (+/-) but be based off a black hole "weight"

            //var yVelocity = black_hole_weight * amplification_effect;
            //var xVelocity = black_hole_weight * amplification_effect;
            moveX += (xVelocity == NaN) ? 0 : xVelocity;
            moveY += (xVelocity == NaN) ? 0 : yVelocity;
        }
    }

    hero_velocity_x += (moveX/sensitivity);
    hero_velocity_y += (moveY/sensitivity);

    for (item in world.obstacles) {
        var checkItem = world.obstacles[item];
        if (collissionDetect(hero_top+hero_velocity_y, hero_left+hero_velocity_x, hero_height, hero_width, checkItem.top, checkItem.left, checkItem.height, checkItem.width)) {
            if (collissionDetect(hero_top+hero_velocity_y, hero_left, hero_height, hero_width, checkItem.top, checkItem.left, checkItem.height, checkItem.width)) {
                hero_velocity_y = 0;
            }
            if (collissionDetect(hero_top, hero_left+hero_velocity_x, hero_height, hero_width, checkItem.top, checkItem.left, checkItem.height, checkItem.width)) {
                hero_velocity_x = 0;
            }
        }
    }

    var new_hero_top = hero_velocity_y + hero_top;
    var new_hero_left = hero_velocity_x + hero_left;
    hero_top = new_hero_top;
    hero_left = new_hero_left;
    $("#hero_div").css("top",new_hero_top+"px");
    $("#hero_div").css("left",new_hero_left+"px");

    //check if the hero has collided with any of the collectables
    for (item in world.collectables) {
        var checkItem = world.collectables[item];

        if (collissionDetect(checkItem.top, checkItem.left, checkItem.height, checkItem.width, hero_top, hero_left, hero_height, hero_width))
        {
            world.collectables[item].el.remove();
            world.collectables.splice(item,1);
        }
    }

    if (world.collectables.length == 0) {
        alert("YOU WON, it took you " + black_holes_used + " black holes.");
        game_active = false;
        $("#gameboard").hide();
        $("#stage_select").show();
        $(".black_hole").remove();
        black_holes = [];
        hero_velocity_x = 0;
        hero_velocity_y = 0;
    } else {
        setTimeout(moveHero, 50);
    }
}

function setStage(stage_num) {
    $("#gameboard").show();
    $("#stage_select").hide();

    $(".collectable").remove();
    world.collectables = [];
    black_holes_used = 0;
    switch (stage_num) {
        case 1:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 100px; left: 200px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 200px; left: 420px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 100, left: 200, height: 6, width: 6});
            world.collectables.push({el: $("#collectable1"), top: 200, left: 420, height: 6, width: 6});
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 1;
            break;
        case 2:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 200px; left: 100px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 100px; left: 260px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 220px; left: 380px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 200, left: 100, height: 6, width: 6});
            world.collectables.push({el: $("#collectable1"), top: 100, left: 260, height: 6, width: 6});
            world.collectables.push({el: $("#collectable2"), top: 220, left: 380, height: 6, width: 6});
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 2;
            break;
        case 3:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 200px; left: 100px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 100px; left: 260px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 220px; left: 380px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 200, left: 100, height: 6, width: 6});
            world.collectables.push({el: $("#collectable1"), top: 100, left: 260, height: 6, width: 6});
            world.collectables.push({el: $("#collectable2"), top: 220, left: 380, height: 6, width: 6});
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 1;
            break;
        case 4:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 100px; left: 100px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 200px; left: 200px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 300px; left: 100px;'></div>");
            $("#gameboard").append("<div id='collectable3' class='collectable' style='top: 400px; left: 300px;'></div>");
            $("#gameboard").append("<div id='collectable4' class='collectable' style='top: 500px; left: 200px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 100, left: 100, height: 6, width: 6});
            world.collectables.push({el: $("#collectable1"), top: 200, left: 200, height: 6, width: 6});
            world.collectables.push({el: $("#collectable2"), top: 300, left: 100, height: 6, width: 6});
            world.collectables.push({el: $("#collectable3"), top: 400, left: 300, height: 6, width: 6});
            world.collectables.push({el: $("#collectable4"), top: 500, left: 200, height: 6, width: 6});
            console.log("loading stage 4");
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 5;
            break;
        case 5: //omgwtfbbq
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 100px; left: 120px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 200px; left: 120px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 140px; left: 380px;'></div>");
            $("#gameboard").append("<div id='collectable3' class='collectable' style='top: 240px; left: 380px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 100, left: 120, height: 6, width: 6});
            world.collectables.push({el: $("#collectable1"), top: 200, left: 120, height: 6, width: 6});
            world.collectables.push({el: $("#collectable2"), top: 140, left: 380, height: 6, width: 6});
            world.collectables.push({el: $("#collectable3"), top: 240, left: 380, height: 6, width: 6});

            $("#gameboard").append("<div id='obstacle0' class='obstacle' style='top:60px;left:260px;width:16px; height: 100px;'></div>");
            $("#gameboard").append("<div id='obstacle1' class='obstacle' style='top:300px;left:260px;width:16px; height: 100px;'></div>");

            //load obstacles
            world.obstacles.push({el:$("#obstacle0"), top: 60, left: 260, width: 16, height: 100});
            world.obstacles.push({el:$("#obstacle1"), top: 300, left: 260, width: 16, height: 100});

            hero_top = 0;
            hero_left = 0;
            max_black_holes = 2;
            break;

    }
    $("#hero_div").css("top",hero_top+"px");
    $("#hero_div").css("left",hero_left+"px");
    setTimeout(function() { game_active = true; }, 100);
    moveHero();
}


function collissionDetect(obj1top, obj1left, obj1height, obj1width, obj2top, obj2left, obj2height, obj2width) {
    if (obj1top <= obj2top + obj2height
        && obj1top + obj1height >= obj2top
        && obj1left <= obj2left + obj2width
        && obj1left + obj1width >= obj2left
    ) {
        return true;
    } else {
        return false;
    }
}

function checkCollision(person, num) {
    for (other in world.people) {
        if (other == num) continue;
        if (world.people[other].top <= person.top + personHeight
            && world.people[other].top + personHeight >= person.top
            && world.people[other].left + personWidth >= person.left
            && world.people[other].left <= person.left + personWidth
        )
        {
            return true;
        }
    }
    return false;
}