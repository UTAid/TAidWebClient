export class KeyMap{
  up = false;
  left = false;
  right = false;
  down = false;
  enter = false;
  tab = false;
  shift = false;
  ctrl = false;
  alt = false;
  escape = false;

  modifier = false;
}

export function getKeyMap(event: KeyboardEvent){
  let ret = new KeyMap();
  ret.alt = event.altKey;
  ret.ctrl = event.ctrlKey;
  ret.shift = event.shiftKey;
  ret.modifier = ret.alt || ret.ctrl || ret.shift;

  switch (event.keyCode){
    case 9: ret.tab = true; break;
    case 13: ret.enter = true; break;
    case 27: ret.escape = true; break;
    case 37: ret.left = true; break;
    case 38: ret.up = true; break;
    case 39: ret.right = true; break;
    case 40: ret.down = true; break;
  }
  return ret;
}
