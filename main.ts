namespace SpriteKind {
    export const aim = SpriteKind.create()
}
function path_move_y () {
    row += randint(0, 1) * 2
    row += -1
    row = Math.constrain(row, 2, grid.numRows() - 3)
    for (let index = 0; index <= 2; index++) {
        temp_column = column + index
        temp_column += -1
        tiles.setTileAt(tiles.getTileLocation(temp_column, row), assets.tile`path`)
    }
}
function path_move_x () {
    column += 1
    for (let index = 0; index <= 2; index++) {
        temp_row = row + index
        temp_row += -1
        tiles.setTileAt(tiles.getTileLocation(column, temp_row), assets.tile`path`)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(is_moving)) {
        direction = spriteutils.degreesToRadians(transformSprites.getRotation(aim_sprite))
        ball.vx = Math.sin(direction) * shot_power * 4
        ball.vy = Math.cos(direction) * shot_power * -4
        info.changeScoreBy(-100)
    }
})
function slow_down () {
    ball.vx = ball.vx * friction
    ball.vy = ball.vy * friction
}
function aiming () {
    aim_sprite.setPosition(ball.x, ball.y)
    if (controller.left.isPressed()) {
        transformSprites.changeRotation(aim_sprite, -1)
    } else if (controller.right.isPressed()) {
        transformSprites.changeRotation(aim_sprite, 1)
    }
    if (controller.up.isPressed()) {
        shot_power += 1
    } else if (controller.down.isPressed()) {
        shot_power += -1
    }
    shot_power = Math.constrain(shot_power, 1, 100)
}
function generate_path () {
    column = 0
    row = randint(2, grid.numRows() - 3)
    tiles.placeOnTile(ball, tiles.getTileLocation(column, row))
    for (let index = 0; index <= 2; index++) {
        temp_row = row + index
        temp_row += -1
        tiles.setTileAt(tiles.getTileLocation(column, temp_row), assets.tile`path`)
    }
    path_move_x()
    while (column < grid.numColumns() - 1) {
        if (randint(1, 2) == 1) {
            path_move_x()
        } else {
            path_move_y()
        }
    }
    tile = tiles.getTileLocation(column, row)
    tiles.placeOnTile(hole, tile)
    tilesAdvanced.setWallOnTilesOfType(assets.tile`rough`, true)
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Player, function (ball, hole) {
    if (spriteutils.distanceBetween(ball, hole) < 7) {
        ball.setVelocity(0, 0)
        setup_level()
    }
})
function setup_level () {
    tiles.setCurrentTilemap(tilemap`level`)
    info.changeScoreBy(1000)
    generate_path()
    transformSprites.rotateSprite(aim_sprite, 90)
}
function check_if_moving () {
    is_moving = Math.abs(ball.vx) > 5 || Math.abs(ball.vy) > 5
}
let tile: tiles.Location = null
let direction = 0
let temp_row = 0
let column = 0
let temp_column = 0
let row = 0
let aim_sprite: Sprite = null
let hole: Sprite = null
let ball: Sprite = null
let shot_power = 0
let is_moving = false
let friction = 0
friction = 0.98
is_moving = false
shot_power = 50
ball = sprites.create(assets.image`ball`, SpriteKind.Projectile)
scene.cameraFollowSprite(ball)
ball.setBounceOnWall(true)
ball.scale = 2 / 3
ball.z = 5
hole = sprites.create(assets.image`hole`, SpriteKind.Player)
let aim_image = image.create(150, 150)
aim_image.fillRect(74, 0, 2, 75, 15)
aim_sprite = sprites.create(aim_image, SpriteKind.aim)
setup_level()
game.onUpdate(function () {
    check_if_moving()
    if (is_moving) {
        aim_sprite.setFlag(SpriteFlag.Invisible, true)
        ball.sayText("")
    } else {
        ball.setVelocity(0, 0)
        aim_sprite.setFlag(SpriteFlag.Invisible, false)
        aiming()
        ball.sayText(shot_power)
    }
    slow_down()
})
