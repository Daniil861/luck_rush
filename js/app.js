(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        if (document.querySelector("body")) setTimeout((function() {
            document.querySelector("body").classList.add("_loaded");
        }), 200);
    }));
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 5e3);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    function add_remove_className(block, className) {
        if (document.querySelector(block).classList.contains(className)) document.querySelector(block).classList.remove(className); else document.querySelector(block).classList.add(className);
    }
    function remove_class(block, className) {
        document.querySelectorAll(block).forEach((el => {
            if (el.classList.contains(className)) el.classList.remove(className);
        }));
    }
    function delete_money(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function no_money(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function add_money(count, block, delay, delay_off) {
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.textContent = +sessionStorage.getItem("money") + count));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
            sessionStorage.setItem("money", +sessionStorage.getItem("money") + count);
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    function get_random_num_arr(mn, mx) {
        function get_rand(mn, mx) {
            return Math.floor(Math.random() * (mx - mn) + mn);
        }
        let arr = [];
        let count = 0;
        return function back() {
            if (25 == count) return arr;
            if (0 == arr.length) {
                let num1 = get_rand(mn, mx);
                arr.push(num1);
                count++;
            }
            if (arr.length == count) {
                let num = get_random(mn, mx);
                if (true == arr.includes(num)) return back(mn, mx);
                arr.push(num);
                count++;
                return back(mn, mx);
            }
        };
    }
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
    const config = {
        numbers: [],
        count: 0,
        count_2: 0,
        current_count_move: 0,
        count_win: 0,
        count_multiple: 0,
        coupon_1: [],
        coupon_2: []
    };
    if (document.querySelector(".game")) {
        if (+sessionStorage.getItem("money") >= 50) sessionStorage.setItem("current-bet", 50); else sessionStorage.setItem("current-bet", 0);
        document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        config.coupon_1 = create_coupon(".game__coupon_1");
    }
    function start_game() {
        config.current_count_move++;
        if (0 == config.count) {
            document.querySelectorAll(".header__coupon").forEach((el => el.classList.add("_hold")));
            delete_money(+sessionStorage.getItem("current-bet"), ".check");
            add_remove_className(".block-bet__controls", "_hold");
            get_current_number(1, 100);
            config.count++;
        } else get_current_number(1, 100);
    }
    function write_number(number) {
        document.querySelector(".actions__value").textContent = number;
        document.querySelector(".actions__number").textContent = config.current_count_move;
    }
    function get_current_number(mn, mx) {
        if (0 == config.count_2) {
            let number = get_random(mn, mx);
            config.numbers.push(number);
            write_number(number);
            check_collision(number);
            select_program_for_check();
            config.count_2++;
        } else {
            let number2 = get_random(mn, mx);
            if (true == config.numbers.includes(number2)) return get_current_number(mn, mx);
            config.numbers.push(number2);
            write_number(number2);
            check_collision(number2);
            select_program_for_check();
        }
    }
    function create_coupon(block) {
        let arr_bg = [ "_purple", "_red", "_orange", "_blue", "_green" ];
        let arg_fonts = [ "Inter", "Londrina", "Lemon" ];
        let random_font = get_random(0, 3);
        let random_num = get_random(0, 5);
        let item = document.createElement("div");
        item.classList.add("game__ticket");
        item.classList.add("ticket");
        let item_body = document.createElement("div");
        item_body.classList.add("ticket__body");
        item_body.classList.add(arr_bg[random_num]);
        let item_header = document.createElement("div");
        item_header.classList.add("ticket__header");
        let span_1 = document.createElement("span");
        let span_2 = document.createElement("span");
        let span_3 = document.createElement("span");
        span_2.textContent = "bingo";
        span_2.style.fontFamily = arg_fonts[random_font];
        item_header.append(span_1, span_2, span_3);
        let item_inner = document.createElement("div");
        item_inner.classList.add("ticket__inner");
        let item_field = document.createElement("div");
        item_field.classList.add("ticket__field");
        let new_arr = get_random_num_arr(1, 100);
        let array = new_arr();
        for (let i = 0; i < array.length; i++) {
            let item_number = document.createElement("div");
            item_number.dataset.number = array[i];
            item_number.dataset.target = 0;
            item_number.classList.add("ticket__item");
            item_number.textContent = array[i];
            item_field.append(item_number);
        }
        item_inner.append(item_field);
        item_body.append(item_header, item_inner);
        item.append(item_body);
        document.querySelector(block).append(item);
        return array;
    }
    function check_active_mode_game() {
        if (!document.querySelector(".header__fields").classList.contains("_active")) document.querySelector(".header__fields").classList.add("_active");
    }
    function check_collision(number) {
        if (true == config.coupon_1.includes(number)) document.querySelectorAll(".ticket__item").forEach((el => {
            if (el.dataset.number == number) {
                el.classList.add("_active");
                el.dataset.target = 1;
            }
        }));
        if (config.coupon_2.length > 0 && true == config.coupon_2.includes(number)) document.querySelectorAll(".ticket__item").forEach((el => {
            if (el.dataset.number == number) {
                el.classList.add("_active");
                el.dataset.target = 1;
            }
        }));
    }
    function select_program_for_check() {
        let level = +sessionStorage.getItem("current-game");
        if (1 == level) {
            check_level_1();
            if (config.coupon_2.length > 0) check_level_1_ticket_2();
        } else if (2 == level) {
            check_level_2();
            if (config.coupon_2.length > 0) check_level_2_ticket_2();
        } else if (3 == level) {
            check_level_3();
            if (config.coupon_2.length > 0) check_level_3_ticket_2();
        } else if (4 == level) {
            check_level_4();
            if (config.coupon_2.length > 0) check_level_4_ticket_2();
        } else if (5 == level) {
            check_level_5();
            if (config.coupon_2.length > 0) check_level_5_ticket_2();
        }
    }
    function check_level_1() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[0].dataset.target && 1 == arr[1].dataset.target && 1 == arr[2].dataset.target && 1 == arr[3].dataset.target && 1 == arr[4].dataset.target || 1 == arr[5].dataset.target && 1 == arr[6].dataset.target && 1 == arr[7].dataset.target && 1 == arr[8].dataset.target && 1 == arr[9].dataset.target || 1 == arr[10].dataset.target && 1 == arr[11].dataset.target && 1 == arr[12].dataset.target && 1 == arr[13].dataset.target && 1 == arr[14].dataset.target || 1 == arr[15].dataset.target && 1 == arr[16].dataset.target && 1 == arr[17].dataset.target && 1 == arr[18].dataset.target && 1 == arr[19].dataset.target || 1 == arr[20].dataset.target && 1 == arr[21].dataset.target && 1 == arr[22].dataset.target && 1 == arr[23].dataset.target && 1 == arr[24].dataset.target) {
            check_count_win_level_1();
            show_screen_win();
        }
    }
    function check_level_1_ticket_2() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[25].dataset.target && 1 == arr[26].dataset.target && 1 == arr[27].dataset.target && 1 == arr[28].dataset.target && 1 == arr[29].dataset.target || 1 == arr[30].dataset.target && 1 == arr[31].dataset.target && 1 == arr[32].dataset.target && 1 == arr[33].dataset.target && 1 == arr[34].dataset.target || 1 == arr[35].dataset.target && 1 == arr[36].dataset.target && 1 == arr[37].dataset.target && 1 == arr[38].dataset.target && 1 == arr[39].dataset.target || 1 == arr[40].dataset.target && 1 == arr[41].dataset.target && 1 == arr[42].dataset.target && 1 == arr[43].dataset.target && 1 == arr[44].dataset.target || 1 == arr[45].dataset.target && 1 == arr[46].dataset.target && 1 == arr[47].dataset.target && 1 == arr[48].dataset.target && 1 == arr[49].dataset.target) {
            check_count_win_level_1();
            show_screen_win();
        }
    }
    function check_level_2() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[20].dataset.target && 1 == arr[15].dataset.target && 1 == arr[10].dataset.target && 1 == arr[5].dataset.target && 1 == arr[0].dataset.target && 1 == arr[1].dataset.target && 1 == arr[2].dataset.target && 1 == arr[3].dataset.target && 1 == arr[4].dataset.target && 1 == arr[9].dataset.target && 1 == arr[14].dataset.target && 1 == arr[19].dataset.target && 1 == arr[24].dataset.target) {
            check_count_win_level_2();
            show_screen_win();
        }
    }
    function check_level_2_ticket_2() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[45].dataset.target && 1 == arr[40].dataset.target && 1 == arr[35].dataset.target && 1 == arr[30].dataset.target && 1 == arr[25].dataset.target && 1 == arr[26].dataset.target && 1 == arr[27].dataset.target && 1 == arr[28].dataset.target && 1 == arr[29].dataset.target && 1 == arr[34].dataset.target && 1 == arr[39].dataset.target && 1 == arr[44].dataset.target && 1 == arr[49].dataset.target) {
            check_count_win_level_2();
            show_screen_win();
        }
    }
    function check_level_3() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[0].dataset.target && 1 == arr[1].dataset.target && 1 == arr[2].dataset.target && 1 == arr[3].dataset.target && 1 == arr[4].dataset.target && 1 == arr[20].dataset.target && 1 == arr[21].dataset.target && 1 == arr[22].dataset.target && 1 == arr[23].dataset.target && 1 == arr[24].dataset.target) {
            check_count_win_level_3();
            show_screen_win();
        }
    }
    function check_level_3_ticket_2() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[25].dataset.target && 1 == arr[26].dataset.target && 1 == arr[27].dataset.target && 1 == arr[28].dataset.target && 1 == arr[29].dataset.target && 1 == arr[45].dataset.target && 1 == arr[46].dataset.target && 1 == arr[47].dataset.target && 1 == arr[48].dataset.target && 1 == arr[49].dataset.target) {
            check_count_win_level_3();
            show_screen_win();
        }
    }
    function check_level_4() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[0].dataset.target && 1 == arr[1].dataset.target && 1 == arr[2].dataset.target && 1 == arr[3].dataset.target && 1 == arr[4].dataset.target && 1 == arr[20].dataset.target && 1 == arr[21].dataset.target && 1 == arr[22].dataset.target && 1 == arr[23].dataset.target && 1 == arr[24].dataset.target && 1 == arr[5].dataset.target && 1 == arr[10].dataset.target && 1 == arr[15].dataset.target && 1 == arr[9].dataset.target && 1 == arr[14].dataset.target && 1 == arr[19].dataset.target) {
            check_count_win_level_4();
            show_screen_win();
        }
    }
    function check_level_4_ticket_2() {
        let arr = document.querySelectorAll(".ticket__item");
        if (1 == arr[25].dataset.target && 1 == arr[26].dataset.target && 1 == arr[27].dataset.target && 1 == arr[28].dataset.target && 1 == arr[29].dataset.target && 1 == arr[45].dataset.target && 1 == arr[46].dataset.target && 1 == arr[47].dataset.target && 1 == arr[48].dataset.target && 1 == arr[49].dataset.target && 1 == arr[30].dataset.target && 1 == arr[35].dataset.target && 1 == arr[40].dataset.target && 1 == arr[34].dataset.target && 1 == arr[39].dataset.target && 1 == arr[44].dataset.target) {
            check_count_win_level_4();
            show_screen_win();
        }
    }
    function check_level_5() {
        let arr = document.querySelectorAll(".ticket__item");
        let check = 0;
        arr.forEach((el => {
            if (0 == el.dataset.target) check = 1;
        }));
        if (1 == check) return false; else {
            check_count_win_level_5();
            show_screen_win();
        }
    }
    function check_level_5_ticket_2() {
        let arr = document.querySelectorAll(".ticket__item");
        let check = 0;
        arr.forEach(((el, i) => {
            if (i >= 25 && 0 == el.dataset.target) check = 1;
        }));
        if (1 == check) return false; else {
            check_count_win_level_5();
            show_screen_win();
        }
    }
    function check_count_win_level_1() {
        if (config.current_count_move >= 5 && config.current_count_move <= 7) {
            config.count_win = 100 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 100;
        } else if (config.current_count_move >= 8 && config.current_count_move <= 20) {
            config.count_win = 50 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 50;
        } else if (config.current_count_move >= 21 && config.current_count_move <= 30) {
            config.count_win = 10 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 10;
        } else if (config.current_count_move >= 31 && config.current_count_move <= 60) {
            config.count_win = 5 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 5;
        } else if (config.current_count_move >= 61 && config.current_count_move <= 89) {
            config.count_win = 2 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 2;
        } else if (config.current_count_move >= 90 && config.current_count_move <= 95) {
            config.count_win = 1 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 1;
        } else if (config.current_count_move >= 96 && config.current_count_move <= 99) {
            config.count_win = .01 * +sessionStorage.getItem("current-bet");
            config.count_multiple = .01;
        }
    }
    function check_count_win_level_2() {
        if (config.current_count_move >= 13 && config.current_count_move <= 16) {
            config.count_win = 100 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 100;
        } else if (config.current_count_move >= 17 && config.current_count_move <= 20) {
            config.count_win = 50 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 50;
        } else if (config.current_count_move >= 21 && config.current_count_move <= 30) {
            config.count_win = 10 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 10;
        } else if (config.current_count_move >= 31 && config.current_count_move <= 60) {
            config.count_win = 5 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 5;
        } else if (config.current_count_move >= 61 && config.current_count_move <= 89) {
            config.count_win = 2 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 2;
        } else if (config.current_count_move >= 90 && config.current_count_move <= 95) {
            config.count_win = 1 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 1;
        } else if (config.current_count_move >= 96 && config.current_count_move <= 99) {
            config.count_win = .01 * +sessionStorage.getItem("current-bet");
            config.count_multiple = .01;
        }
    }
    function check_count_win_level_3() {
        if (config.current_count_move >= 10 && config.current_count_move <= 12) {
            config.count_win = 100 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 100;
        } else if (config.current_count_move >= 13 && config.current_count_move <= 20) {
            config.count_win = 50 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 50;
        } else if (config.current_count_move >= 21 && config.current_count_move <= 30) {
            config.count_win = 10 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 10;
        } else if (config.current_count_move >= 31 && config.current_count_move <= 60) {
            config.count_win = 5 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 5;
        } else if (config.current_count_move >= 61 && config.current_count_move <= 89) {
            config.count_win = 2 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 2;
        } else if (config.current_count_move >= 90 && config.current_count_move <= 95) {
            config.count_win = 1 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 1;
        } else if (config.current_count_move >= 96 && config.current_count_move <= 99) {
            config.count_win = .01 * +sessionStorage.getItem("current-bet");
            config.count_multiple = .01;
        }
    }
    function check_count_win_level_4() {
        if (config.current_count_move >= 16 && config.current_count_move <= 18) {
            config.count_win = 100 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 100;
        } else if (config.current_count_move >= 18 && config.current_count_move <= 25) {
            config.count_win = 50 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 50;
        } else if (config.current_count_move >= 26 && config.current_count_move <= 30) {
            config.count_win = 10 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 10;
        } else if (config.current_count_move >= 31 && config.current_count_move <= 60) {
            config.count_win = 5 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 5;
        } else if (config.current_count_move >= 61 && config.current_count_move <= 89) {
            config.count_win = 2 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 2;
        } else if (config.current_count_move >= 90 && config.current_count_move <= 95) {
            config.count_win = 1 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 1;
        } else if (config.current_count_move >= 96 && config.current_count_move <= 99) {
            config.count_win = .01 * +sessionStorage.getItem("current-bet");
            config.count_multiple = .01;
        }
    }
    function check_count_win_level_5() {
        if (config.current_count_move >= 25 && config.current_count_move <= 30) {
            config.count_win = 100 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 100;
        } else if (config.current_count_move >= 30 && config.current_count_move <= 35) {
            config.count_win = 50 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 50;
        } else if (config.current_count_move >= 36 && config.current_count_move <= 50) {
            config.count_win = 10 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 10;
        } else if (config.current_count_move >= 51 && config.current_count_move <= 60) {
            config.count_win = 5 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 5;
        } else if (config.current_count_move >= 61 && config.current_count_move <= 89) {
            config.count_win = 2 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 2;
        } else if (config.current_count_move >= 90 && config.current_count_move <= 95) {
            config.count_win = 1 * +sessionStorage.getItem("current-bet");
            config.count_multiple = 1;
        } else if (config.current_count_move >= 96 && config.current_count_move <= 99) {
            config.count_win = .01 * +sessionStorage.getItem("current-bet");
            config.count_multiple = .01;
        }
    }
    function show_screen_win() {
        add_money(config.count_win, ".check", 1e3, 2e3);
        add_remove_className(".actions__button-start", "_hold");
        document.querySelector(".win").classList.add("_active");
        document.querySelector(".win__text").textContent = config.count_win;
        document.querySelector(".win__multiple").textContent = `x${config.count_multiple}`;
    }
    function reset_level() {
        document.querySelector(".win").classList.remove("_active");
        document.querySelector(".header__fields").classList.remove("_active");
        remove_class(".header__coupon", "_active");
        document.querySelectorAll(".header__coupon").forEach((el => el.classList.remove("_hold")));
        add_remove_className(".block-bet__controls", "_hold");
        add_remove_className(".actions__button-start", "_hold");
        config.numbers = [];
        config.count = 0;
        config.count_2;
        config.current_count_move = 0;
        config.count_win = 0;
        config.count_multiple = 0;
        config.coupon_1 = [];
        config.coupon_2 = [];
        document.querySelectorAll(".ticket").forEach((el => el.remove()));
        if (document.querySelector(".game__store").classList.contains("_hide")) add_remove_className(".game__store", "_hide");
        if (document.querySelector(".game__store-inner").classList.contains("_hold")) add_remove_className(".game__store-inner", "_hold");
        write_number("start");
        config.coupon_1 = create_coupon(".game__coupon_1");
        if (+sessionStorage.getItem("money") < +sessionStorage.getItem("current-bet")) {
            sessionStorage.setItem("current-bet", 0);
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        }
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
        }
        if (targetElement.closest(".block-bet__minus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            if (current_bet >= 50) {
                sessionStorage.setItem("current-bet", current_bet - 50);
                document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
            }
        }
        if (targetElement.closest(".block-bet__plus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            let current_bank = +sessionStorage.getItem("money");
            if (current_bank - 49 > current_bet) {
                sessionStorage.setItem("current-bet", current_bet + 50);
                document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
            } else no_money(".check");
        }
        if (targetElement.closest(".actions__button-start") && document.querySelector(".header__fields").classList.contains("_active")) {
            start_game();
            targetElement.closest(".actions__button-start").classList.add("_not-active");
            setTimeout((() => {
                targetElement.closest(".actions__button-start").classList.remove("_not-active");
            }), 250);
            if (0 == config.coupon_2.length && !document.querySelector(".game__store-inner").classList.contains("_hold")) document.querySelector(".game__store-inner").classList.add("_hold");
        } else if (targetElement.closest(".actions__button-start") && !document.querySelector(".header__fields").classList.contains("_active")) {
            document.querySelector(".header__fields").classList.add("_anim");
            setTimeout((() => {
                document.querySelector(".header__fields").classList.remove("_anim");
            }), 400);
        }
        if (targetElement.closest(".header__coupon_1")) {
            sessionStorage.setItem("current-game", 1);
            remove_class(".header__coupon", "_active");
            document.querySelector(".header__coupon_1").classList.add("_active");
            check_active_mode_game();
        }
        if (targetElement.closest(".header__coupon_2")) {
            sessionStorage.setItem("current-game", 2);
            remove_class(".header__coupon", "_active");
            document.querySelector(".header__coupon_2").classList.add("_active");
            check_active_mode_game();
        }
        if (targetElement.closest(".header__coupon_3")) {
            sessionStorage.setItem("current-game", 3);
            remove_class(".header__coupon", "_active");
            document.querySelector(".header__coupon_3").classList.add("_active");
            check_active_mode_game();
        }
        if (targetElement.closest(".header__coupon_4")) {
            sessionStorage.setItem("current-game", 4);
            remove_class(".header__coupon", "_active");
            document.querySelector(".header__coupon_4").classList.add("_active");
            check_active_mode_game();
        }
        if (targetElement.closest(".header__coupon_5")) {
            sessionStorage.setItem("current-game", 5);
            remove_class(".header__coupon", "_active");
            document.querySelector(".header__coupon_5").classList.add("_active");
            check_active_mode_game();
        }
        if (targetElement.closest(".win__button_play")) reset_level();
        if (targetElement.closest(".game__button")) if (+sessionStorage.getItem("money") >= 1e3) {
            delete_money(1e3, ".check");
            add_remove_className(".game__store", "_hide");
            config.coupon_2 = create_coupon(".game__coupon_2");
        } else no_money(".check");
    }));
    window["FLS"] = true;
    isWebp();
})();