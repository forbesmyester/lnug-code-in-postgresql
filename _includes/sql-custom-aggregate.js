function get_race_time(comp_count) {

    function callback(accumulator, currentValue) {
        if (accumulator.length < comp_count) {
            return accumulator.concat([currentValue]);
        }
        const r = accumulator.concat([currentValue]);
        const min = accumulator.reduce((a, b) => Math.min(a, b), 99);
        r.splice(r.indexOf(min), 1);
        return r;
    };

    function finalizer(accumulator) { // imperative for the purpose
        let result = 0;               // of blog text readability.
        for (let i = 0; i < accumulator.length; i++) {
            result = result + accumulator[i];
        }
        return result / accumulator.length;
    }


    return function race_time_implementation(number_array) {
        const initialValue = [];
        let reduceResult = number_array.reduce(callback, initialValue);
        return finalizer(reduceResult);
    };

}

const race_time = get_race_time(3);
console.log(race_time([0, 1, 2, 3]));
