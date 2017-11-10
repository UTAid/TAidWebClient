export class RecentActions {

  private actions = [];
  private number_of_actions = 10;

  constructor(){
  }

  add_action(action){
    if (this.is_full()){
      this.actions.pop();
    }
    this.actions.unshift(action);
  }

  get_action(){
    if (!this.is_empty()){
      return this.actions.shift();
    }
    return null;
  }

  is_empty(){ return this.actions.length <= 0; }
  is_full(){ return this.actions.length >= 10; }

  print_action(){ console.log(this.actions); }

}
