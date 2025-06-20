 /*$$$$$$$ /$$                                               /$$             
| $$_____/| $$                                              | $$             
| $$      | $$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$$$$   | $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$__/   | $$| $$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$      | $$| $$_____/| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$\____  $$
| $$$$$$$$| $$|  $$$$$$$| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
|________/|__/ \_______/|__/ |__/ |__/ \_______/|__/  |__/   \___/ |______*/ 

const map = document.getElementById('map')
const mapImage = document.getElementById('mapImage')
const categoriesMenu = document.getElementById('categoriesMenu')
const pinMenu = document.getElementById('pinMenu')
const pinMenuName = document.getElementById('pinMenuName')
const pinMenuDescription = document.getElementById('pinMenuDescription')



  /*$$$$$              /$$     /$$     /$$                              
 /$$__  $$            | $$    | $$    |__/                              
| $$  \__/  /$$$$$$  /$$$$$$ /$$$$$$   /$$ /$$$$$$$   /$$$$$$   /$$$$$$$
|  $$$$$$  /$$__  $$|_  $$_/|_  $$_/  | $$| $$__  $$ /$$__  $$ /$$_____/
 \____  $$| $$$$$$$$  | $$    | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
 /$$  \ $$| $$_____/  | $$ /$$| $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
|  $$$$$$/|  $$$$$$$  |  $$$$/|  $$$$/| $$| $$  | $$|  $$$$$$$ /$$$$$$$/
 \______/  \_______/   \___/   \___/  |__/|__/  |__/ \____  $$|_______/ 
                                                     /$$  \ $$          
                                                    |  $$$$$$/          
                                                     \_____*/           

const settings = {
    //Screen
    screen: new Vec2(),
    screenMin: -1,  //The min between screen width & height

    //Translation
    pos: new Vec2(DB.get('pos', 0, DB.OBJECT)),

    //Zoom
    zoom: DB.get('zoom', 1, DB.NUMBER),
    zoomMult: 0.001, 
    zoomMin: 0.8,
    zoomMax: 10,
}



  /*$$$$$                                                   
 /$$__  $$                                                  
| $$  \__/  /$$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$ 
|  $$$$$$  /$$_____/ /$$__  $$ /$$__  $$ /$$__  $$| $$__  $$
 \____  $$| $$      | $$  \__/| $$$$$$$$| $$$$$$$$| $$  \ $$
 /$$  \ $$| $$      | $$      | $$_____/| $$_____/| $$  | $$
|  $$$$$$/|  $$$$$$$| $$      |  $$$$$$$|  $$$$$$$| $$  | $$
 \______/  \_______/|__/       \_______/ \_______/|__/  |_*/
 
function resize() {
    settings.screen = new Vec2(window.innerWidth, window.innerHeight)
    settings.screenMin = Math.min(settings.screen.x, settings.screen.y)
}

window.addEventListener('resize', resize)

resize()



 /*$$$$$$$                                     /$$             /$$     /$$                    
|__  $$__/                                    | $$            | $$    |__/                    
   | $$  /$$$$$$  /$$$$$$  /$$$$$$$   /$$$$$$$| $$  /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
   | $$ /$$__  $$|____  $$| $$__  $$ /$$_____/| $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
   | $$| $$  \__/ /$$$$$$$| $$  \ $$|  $$$$$$ | $$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
   | $$| $$      /$$__  $$| $$  | $$ \____  $$| $$ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
   | $$| $$     |  $$$$$$$| $$  | $$ /$$$$$$$/| $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
   |__/|__/      \_______/|__/  |__/|_______/ |__/ \_______/   \___/  |__/ \______/ |__/  |_*/
   
//Apply settings translation
map.setAttribute('posX', `${settings.pos.x}px`)
map.setAttribute('posY', `${settings.pos.y}px`)

//Translate functions
function translateTo(pos) {
    //Update settings position
    const scale = settings.screenMin * settings.zoom
    settings.pos = pos.clampMagnitude(scale)
    DB.set('pos', settings.pos)

    //Update map position
    map.setAttribute('posX', `${settings.pos.x}px`)
    map.setAttribute('posY', `${settings.pos.y}px`)
}

function translate(delta) {
    translateTo(settings.pos.add(delta))
}

//Drag listener to move map while dragging with the mouse
class DragListener {

    //Drag info
    isDragging = false
    position = new Vec2()
    onDragCallback

    
    //Constructor
    constructor(element, onDragCallback) {
        //Save drag callback
        this.onDragCallback = onDragCallback

        //Add listeners
        element.addEventListener('mousedown', (event) => { this.onDragStart(event) });
        document.addEventListener('mousemove', (event) => { this.onDrag(event) });
        document.addEventListener('mouseup', (event) => { this.onDragEnd(event) });
    }

    //Drag functions
    onDragStart(event) {
        //Start dragging
        this.isDragging = true
        
        //Get initial position
        this.position = Util.getPositionFromEvent(event)
        
    }

    onDrag(event) {
        //Not dragging -> Ignore
        if (!this.isDragging) return
        event.preventDefault()
        
        //Calculate delta & update position
        const newPosition = Util.getPositionFromEvent(event)
        const delta = newPosition.subtract(this.position)
        this.position = newPosition

        //Call on drag callback
        this.onDragCallback(delta)
    }

    onDragEnd(event) {
        //Finish dragging
        this.isDragging = false
    }

}

const mapDrag = new DragListener(document, translate)



 /*$$$$$$$                                  
|_____ $$                                   
     /$$/   /$$$$$$   /$$$$$$  /$$$$$$/$$$$ 
    /$$/   /$$__  $$ /$$__  $$| $$_  $$_  $$
   /$$/   | $$  \ $$| $$  \ $$| $$ \ $$ \ $$
  /$$/    | $$  | $$| $$  | $$| $$ | $$ | $$
 /$$$$$$$$|  $$$$$$/|  $$$$$$/| $$ | $$ | $$
|________/ \______/  \______/ |__/ |__/ |_*/

//Apply settings zoom
map.setAttribute('zoom', settings.zoom)
map.setAttribute('pin-opacity', Util.clamp(settings.zoom - 2, 0, 1))

//Zoom function
function zoom(event) {
    //Update settings zoom
    const oldZoom = settings.zoom
    const newZoom = Util.clamp(
        oldZoom - event.deltaY * (oldZoom * settings.zoomMult),
        settings.zoomMin,
        settings.zoomMax
    )
    settings.zoom = newZoom
    DB.set('zoom', settings.zoom)

    //Update map zoom
    map.setAttribute('zoom', settings.zoom)
    map.setAttribute('pin-opacity', Util.clamp(settings.zoom - 2, 0, 1))

    //Get mouse & map positions (origin on screen center)
    const mousePosition = Util.centerMousePosition(Util.getPositionFromEvent(event))
    const mapPosition = settings.pos
    
    //Translate map to keep mouse in (around) the same spot (in reality its not working too well lol)
    const delta = mousePosition.subtract(mapPosition).multiply(-(newZoom / oldZoom - 1))
    translate(delta)
}

//Zoom with mouse wheel
map.addEventListener('wheel', zoom)



  /*$$$$$              /$$                                             /$$                    
 /$$__  $$            | $$                                            |__/                    
| $$  \__/  /$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$  /$$$$$$   /$$$$$$$
| $$       |____  $$|_  $$_/   /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$| $$ /$$__  $$ /$$_____/
| $$        /$$$$$$$  | $$    | $$$$$$$$| $$  \ $$| $$  \ $$| $$  \__/| $$| $$$$$$$$|  $$$$$$ 
| $$    $$ /$$__  $$  | $$ /$$| $$_____/| $$  | $$| $$  | $$| $$      | $$| $$_____/ \____  $$
|  $$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$/| $$      | $$|  $$$$$$$ /$$$$$$$/
 \______/  \_______/   \___/   \_______/ \____  $$ \______/ |__/      |__/ \_______/|_______/ 
                                         /$$  \ $$                                            
                                        |  $$$$$$/                                            
                                         \_____*/                                             

//Current categories
const categories = DB.get('categories', {
    default: {
        id: 'default',
        name: 'Category',
        color: '#344863',
    }
}, DB.OBJECT)

//Categories list adapter
const categoriesList = []
for (const key of Object.keys(categories)) categoriesList.push(categories[key])

const categoriesAdapter = new ListAdapter(document.getElementById('categoriesList'), categoriesList, (category) => {
    //Create element
    const element = document.createElement('div')
    element.classList.add('category')
    element.setAttribute('color', category.color)
    element.setAttribute('title', category.name)

    //Create color input
    const color = document.createElement('input')
    color.type = 'color'
    color.value = category.color
    color.oninput = (event) => {
        element.setAttribute('color', color.value)
        category.color = color.value
    }
    color.onchange = () => {
        saveCategories()
        pinsAdapter.notifyDataSetChanged()
        pinCategoriesAdapter.notifyDataSetChanged()
    }
    element.append(color)

    //Create text input
    const text = document.createElement('input')
    text.type = 'text'
    text.value = category.name
    text.oninput = (event) => {
        element.setAttribute('title', text.value)
        category.name = text.value
    }
    text.onchange = () => {
        saveCategories()
        pinsAdapter.notifyDataSetChanged()
        pinCategoriesAdapter.notifyDataSetChanged()
    }
    element.append(text)

    //Delete category on right click
    element.oncontextmenu = (event) => {
        event.stopPropagation()
        event.preventDefault()

        //Only one category -> Don't delete
        if (categoriesList.length <= 1) return

        //Remove category from lists
        const index = categoriesList.indexOf(category)
        if (index != -1) {
            categoriesList.splice(index, 1)
            categoriesAdapter.notifyItemRemovedAt(index)
            pinCategoriesAdapter.notifyItemRemovedAt(index)
        }
        delete categories[category.id]
        saveCategories()

        //Update pins to reset pins that had this category
        pinsAdapter.notifyDataSetChanged()
    }

    //Bind element
    return element
})

//Categories menu
function toggleCategoriesMenu(show) {
    //Check if should show or hide
    if (typeof show !== 'boolean') show = categoriesMenu.hasAttribute('hidden')
    
    //Toggle menu
    if (show)
        categoriesMenu.removeAttribute('hidden')
    else
        categoriesMenu.setAttribute('hidden', '')
}

//Category functions
function saveCategories() {
    DB.set('categories', categories)
}

function addCategory(category) {
    //Category exists -> Destroy it & readd it
    if (typeof categories[category.id] == 'object') {
        const element = document.getElementById(category.id)
        if (element) element.remove()
    }

    //Add category to lists
    categoriesList.push(category)
    categories[category.id] = category
    saveCategories()

    //Notify categories adapters
    categoriesAdapter.notifyItemAddedAt(categoriesList.length - 1)
    pinCategoriesAdapter.notifyItemAddedAt(categoriesList.length - 1)
}

function createCategory() {
    //Create pin
    addCategory({
        id: new Date().getTime(),
        name: 'Category',
        color: '#344863',
    })
}

//Other
function onMapImage(event) {
    //Get image
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    //Load image into map
    const reader = new FileReader()
    reader.onload = (e) => {
        mapImage.src = e.target.result
    }
    reader.readAsDataURL(selectedFile)
}

function onBackupData() {
    //Create data download url
    const data = {
        categories: categories,
        pins: pins,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    //Temp a element to download file
    const a = document.createElement('a');
    a.href = url
    a.download = 'map-pinner-data.json'
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

function onRestoreData(event) {
    //Get json
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    //Load image into map
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            //Parse json
            const json = JSON.parse(e.target.result)

            //Load categories
            if (json.categories) {
                //Clear previous categories
                for (const key in categories) delete categories[key]
                categoriesList.length = 0

                //Copy new categories
                Object.assign(categories, json.categories)
                for (const key of Object.keys(categories)) categoriesList.push(categories[key])
                saveCategories()
            }

            //Load pins
            if (json.pins) {
                //Clear previous pins
                for (const key in pins) delete pins[key]
                pinsList.length = 0

                //Copy new pins
                Object.assign(pins, json.pins)
                for (const key of Object.keys(pins)) pinsList.push(pins[key])
                savePins()
            }

            //Reload lists
            categoriesAdapter.notifyDataSetChanged()
            pinsAdapter.notifyDataSetChanged()
            pinCategoriesAdapter.notifyDataSetChanged()
        } catch (error) {
            //Error while loading
            alert("Error while loading data")
            console.log(error)
        }
    }
    reader.readAsText(selectedFile)
}



 /*$$$$$$  /$$                    
| $$__  $$|__/                    
| $$  \ $$ /$$ /$$$$$$$   /$$$$$$$
| $$$$$$$/| $$| $$__  $$ /$$_____/
| $$____/ | $$| $$  \ $$|  $$$$$$ 
| $$      | $$| $$  | $$ \____  $$
| $$      | $$| $$  | $$ /$$$$$$$/
|__/      |__/|__/  |__/|______*/ 

//Current pins
const pins = DB.get('pins', {}, DB.OBJECT)

//Pins list adapter
const pinsList = []
for (const key of Object.keys(pins)) pinsList.push(pins[key])

const pinsAdapter = new ListAdapter(document.getElementById('mapPins'), pinsList, (pin) => {
    //Create element
    const element = document.createElement('div')
    element.id = pin.id
    element.classList.add('pin')
    element.setAttribute('posX', pin.pos.x)
    element.setAttribute('posY', pin.pos.y)
    if (!pin.category || !categories[pin.category]) pin.category = categoriesList[0].id
    element.setAttribute('color', categories[pin.category].color)

    //Create element name
    if (pin.name) {
        const name = document.createElement('span')
        name.innerText = pin.name
        element.append(name)
    }

    //Prevent background clicks
    element.ondblclick = (event) => {
        event.stopPropagation()
    }

    //Show menu on click
    element.onclick = (event) => {
        event.stopPropagation()
        showPinMenu(pin.id)
    }

    //Delete pin on right click
    element.oncontextmenu = (event) => {
        event.stopPropagation()
        event.preventDefault()

        //Remove pin from lists
        const index = pinsList.indexOf(pin)
        if (index != -1) {
            pinsList.splice(index, 1)
            pinsAdapter.notifyItemRemovedAt(index)
        }
        delete pins[pin.id]
        savePins()

        //Hide pin menu
        hidePinMenu()
    }

    //Bind element
    return element
})

const pinCategoriesAdapter = new ListAdapter(document.getElementById('pinMenuCategories'), categoriesList, (category) => {})

//Pin menu
function showPinMenu(id) {
    //Get pin
    const pin = pins[id]
    if (typeof pin !== 'object') return
    
    //Show pin menu
    pinMenu.removeAttribute('hidden')
    
    //Update name
    pinMenuName.value = pin.name ? pin.name : ""
    pinMenuName.oninput = (event) => {
        pin.name = pinMenuName.value
    }
    pinMenuName.onchange = () => {
        savePins()
        pinsAdapter.notifyDataSetChanged()
    }

    //Update description
    pinMenuDescription.value = pin.description ? pin.description : ""
    pinMenuDescription.oninput = (event) => {
        pin.description = pinMenuDescription.value
    }
    pinMenuDescription.onchange = savePins

    //Update categories
    pinCategoriesAdapter.onBind = (category) => {
        //Create element
        const element = document.createElement('div')
        element.classList.add('pinCategory')
        element.setAttribute('color', category.color)
        element.setAttribute('title', category.name)

        //Update color on click
        element.onclick = (event) => {
            pin.category = category.id
            pinsAdapter.notifyDataSetChanged()
        }

        //Bind element
        return element
    }
    pinCategoriesAdapter.notifyDataSetChanged()
}

function hidePinMenu() {
    pinMenu.setAttribute('hidden', '')
}

//Pin functions
function savePins() {
    DB.set('pins', pins)
}

function addPin(pin) {
    //Pin exists -> Destroy it & readd it
    if (typeof pins[pin.id] == 'object') {
        const element = document.getElementById(pin.id)
        if (element) element.remove()
    }

    //Add pin to lists
    pinsList.push(pin)
    pins[pin.id] = pin
    savePins()

    //Notify pins adapter
    pinsAdapter.notifyItemAddedAt(pinsList.length - 1)
}

//Add pin on double click
map.addEventListener('dblclick', (event) => {
    //Get mouse & map position
    const mousePosition = Util.centerMousePosition(Util.getPositionFromEvent(event))
    const mapPosition = settings.pos

    //Get normalized mouse position
    const scale = settings.screenMin * settings.zoom
    const mousePositionNormalized = mousePosition.subtract(mapPosition).divide(scale).add(new Vec2(0.5))

    //Create pin
    const pin = {
        id: mousePositionNormalized.toString(),
        pos: mousePositionNormalized,
        category: categoriesList[0].id,
    }
    addPin(pin)
    showPinMenu(pin.id)
})