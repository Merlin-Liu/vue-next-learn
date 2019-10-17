function observe(data) {
    if (!isObject(data) or !isArray(data)) {
        return 
    }

    if (isObject(data)) {
        for (key in data) {
            defineReactive(data[key])
        }
    }

    if (isArray(data)) {
        data.forEach((val) => {
            observe(val)
        })
    }
}

function defineReactive(obj, key, val) {
    observe(val)

    Object.defineProperty(obj, key, { get, set })
}



// option.data:
// {
//     state: {
//         name: 'vue2'
//     }
// }

observe(option.data)