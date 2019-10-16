function observe(data) {
    if (isObject(data)) {
        for (key in data) {
            defineReactive(data[key])
        }
    }

    if (isArray(data) {
        data.forEach(() => {

        })
    }
}   



// option.data:
// {
//     state: {
//         name: 'vue2'
//     }
// }

observe(option.data)