 /*$    /$$                      /$$                        
| $$   | $$                     | $$                        
| $$   | $$ /$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$ 
|  $$ / $$//$$__  $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$
 \  $$ $$/| $$$$$$$$| $$        | $$    | $$  \ $$| $$  \__/
  \  $$$/ | $$_____/| $$        | $$ /$$| $$  | $$| $$      
   \  $/  |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$/| $$      
    \_/    \_______/ \_______/   \___/   \______/ |_*/      

class Vec2 {

    //Values
    x = 0
    y = 0

    //Constructor
    constructor(x, y) {
        if (typeof x === 'object') {
            //Init from another Vec2
            this.x = x.x
            this.y = x.y
        } else {
            //Init from numbers
            if (typeof x == 'number') 
                this.x = x
            if (typeof y == 'number') 
                this.y = y
            else
                this.y = this.x //Copy x if no y
        }

    }

    //Functions
    equals(v) {
        return (this.x == v.x && this.y == v.y)
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y)
    }

    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    multiply(n) { 
        return new Vec2(this.x * n, this.y * n)
    }

    divide(n) { 
        return new Vec2(this.x / n, this.y / n)
    }

    magnitude() { 
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    clampMagnitude(max) {
        const magnitude = this.magnitude()
        if (magnitude > max)
            return this.divide(magnitude).multiply(max)
        else
            return new Vec2(this)
    }

    normalized() { 
        return this.divide(this.magnitude())
    }

    moveTowards(towards, delta) {
        const dir = towards.subtract(this)
        if (dir.magnitude() > delta)
            return this.add(dir.normalized().multiply(delta))
        else
            return towards
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
    
}



  /*$$$$$   /$$                                                     
 /$$__  $$ | $$                                                     
| $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$ 
|  $$$$$$|_  $$_/   /$$__  $$ /$$__  $$|____  $$ /$$__  $$ /$$__  $$
 \____  $$ | $$    | $$  \ $$| $$  \__/ /$$$$$$$| $$  \ $$| $$$$$$$$
 /$$  \ $$ | $$ /$$| $$  | $$| $$      /$$__  $$| $$  | $$| $$_____/
|  $$$$$$/ |  $$$$/|  $$$$$$/| $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$
 \______/   \___/   \______/ |__/      \_______/ \____  $$ \_______/
                                                 /$$  \ $$          
                                                |  $$$$$$/          
                                                 \_____*/           

class DB {

    static BOOLEAN = 'boolean'
    static NUMBER = 'number'
    static OBJECT = 'object'
    static STRING = 'string'

    static get(key, fallback, type) {
        //Check args
        if (typeof key !== 'string') return
        if (typeof type !== 'string') type = ''

        //Get key value
        const value = localStorage.getItem(key)
        if (value == null) return fallback

        //Check type
        switch (type) {
            //Boolean
            case DB.BOOLEAN:
                return value == 'true'
            //Number
            case DB.NUMBER:
                return Number(value)
            //Object
            case DB.OBJECT:
                return JSON.parse(value)
            //String & other (localStorage returns strings by default)
            case DB.STRING:
            default:
                return value
        }
    }

    static set(key, value) {
        //Check args
        if (typeof key !== 'string') return

        //Update key value
        localStorage.setItem(key, typeof value == DB.OBJECT ? JSON.stringify(value) : value)
    }

    static has(key) {
        //Check args
        if (typeof key !== 'string') return false

        //Check if key exists
        return (localStorage.getItem(key) != null)
    }

    static remove(key) {
        //Check args
        if (typeof key !== 'string') return

        //Remove key
        localStorage.removeItem(key)
    }

}



 /*$       /$$             /$$             
| $$      |__/            | $$             
| $$       /$$  /$$$$$$$ /$$$$$$   /$$$$$$$
| $$      | $$ /$$_____/|_  $$_/  /$$_____/
| $$      | $$|  $$$$$$   | $$   |  $$$$$$ 
| $$      | $$ \____  $$  | $$ /$$\____  $$
| $$$$$$$$| $$ /$$$$$$$/  |  $$$$//$$$$$$$/
|________/|__/|_______/    \___/ |______*/ 

class ListAdapter {

    parent  //The parente element to add elements to
    items   //The list of objects used to create the elements
    onBind  //The function that transforms list items to elements

    constructor(parent, items, onBind) {
        this.parent = parent
        this.items = items
        this.onBind = onBind

        this.notifyDataSetChanged()
    }

    notifyDataSetChanged() {
        //Clear all elements
        this.parent.innerHTML = ''

        //Add items again
        for (const item of this.items) {
            this.parent.append(this.onBind(item))
        }
    }

    notifyItemAddedAt(index) {
        //Create element
        const element = this.onBind(this.items[index])

        //Append element
        if (index == this.items.length - 1) {
            //Last item -> Appent to parent
            this.parent.append(element)
        } else {
            //Not last item -> Append before the child at that index
            const child = this.parent.children[index]
            if (child) this.parent.insertBefore(child, element)
        }
    }

    notifyItemRemovedAt(index) {
        //Remove element at index
        const element = this.parent.children[index]
        if (element) element.remove()
    }

}



 /*$   /$$   /$$     /$$ /$$
| $$  | $$  | $$    |__/| $$
| $$  | $$ /$$$$$$   /$$| $$
| $$  | $$|_  $$_/  | $$| $$
| $$  | $$  | $$    | $$| $$
| $$  | $$  | $$ /$$| $$| $$
|  $$$$$$/  |  $$$$/| $$| $$
 \______/    \___/  |__/|_*/

class Util {

    static clamp(x, min, max) {
        return Math.min(Math.max(x, min), max)
    }

    static getPositionFromEvent(event) {
        return new Vec2(event.clientX, event.clientY)
    }

    static centerMousePosition(mouse) {
        return mouse.subtract(settings.screen.multiply(0.5))
    }

}