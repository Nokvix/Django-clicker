function call_click() {
    fetch('/call_click', {
        method: 'GET'
    }).then(response => {
        if (response.ok) {
            return response.json()
        }

        return Promise.reject(response)
    }).then(data => {
        document.getElementById('coins').innerText = `Количество монет: ${data.core.coins}`
        if (data.is_levelup) {
            get_boosts()
        }
    }).catch(error => console.log(error))
}

function get_boosts() {
    fetch('/boosts', {
        method: 'GET'
    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return Promise.reject(response)
    }).then(boosts => {
        const panel = document.getElementById('boosts-holder')
        panel.innerHTML = ''
        boosts.forEach(boost => {
            add_boost(panel, boost)
        })
    }).catch(error => console.log(error))
}

function add_boost(parent, boost) {
    const button = document.createElement('button')
    button.setAttribute('class', 'boost')
    button.setAttribute('id', `boost_${boost.id}`)
    button.setAttribute('onclick', `buy_boost(${boost.id})`)
    button.innerHTML = `
        <p>Уровень: <span id="boost_level">${boost.lvl}</span></p>
        <p>+<span id="boost_power">${boost.power}</span></p>
        <p>Цена: <span id="boost_price">${boost.price}</span></p>
    `
    parent.appendChild(button)
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

///** Функция покупки буста */
function buy_boost(boost_id) {
    const csrftoken = getCookie('csrftoken') // Забираем токен из кукесов

    fetch(`/boost/${boost_id}/`, {
        method: 'PUT', // Теперь метод POST, потому что мы изменяем данные в базе
        headers: { // Headers - мета-данные запроса
            "X-CSRFToken": csrftoken, // Токен для защиты от CSRF-атак, без него не будет работать
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(response => {
        if (response.error) return
        const old_boost_stats = response.old_boost_stats
        const new_boost_stats = response.new_boost_stats

        const coinsElement = document.getElementById('coins')
        const part = coinsElement.innerText.split(':')
        const coins = Number(part[1].trim())
        coinsElement.innerText = `Количество монет: ${coins - old_boost_stats.price}`
        const powerElement = document.getElementById('click_power')
        powerElement.innerText = Number(powerElement.innerText) + old_boost_stats.power

        update_boost(new_boost_stats) // Обновляем буст на фронтике
    }).catch(err => console.log(err))
}

function update_boost(boost) {
    const boost_node = document.getElementById(`boost_${boost.id}`);
    if (boost_node) {
        const boostLevelElement = boost_node.querySelector('#boost_level');
        const boostPowerElement = boost_node.querySelector('#boost_power');
        const boostPriceElement = boost_node.querySelector('#boost_price');

        if (boostLevelElement) boostLevelElement.innerText = boost.lvl;
        if (boostPowerElement) boostPowerElement.innerText = boost.power;
        if (boostPriceElement) boostPriceElement.innerText = boost.price;
    } else {
        console.error(`Boost node with ID 'boost_${boost.id}' not found.`);
    }
}