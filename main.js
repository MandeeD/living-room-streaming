// getData
async function getData() {
    let response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json');

    let data;
    if (response.status == 200) {
        data = await response.json();
    }

    return data;
}

function displayCards(data) {
    let root = document.getElementById('root');
    let containers = data.data.StandardCollection.containers;
    
    for (container in containers) {
        let html = '<div class="category"><h2 class="category-title">'
        + containers[container].set.text.title.full.set.default.content +
        '</h2><div class="category-container">';

        let items = containers[container].set.items;
        for (item in items) {
            let img = '';
            // there are a lot of different data options...? hopefully hitting them all
            if (items[item].image.tile[1.78].series !== undefined) {
                img = items[item].image.tile[1.78].series.default.url;
            } else if (items[item].image.tile[1.78].program !== undefined) {
                img = items[item].image.tile[1.78].program.default.url; 
            } else if (items[item].image.tile[1.78].default !== undefined) {
                img = items[item].image.tile[1.78].default.default.url;
            }
            
            html += '<button class="category-card" style="background-image:url('+img+')"></button>';
        }

        html += '</div></div>';

        root.innerHTML += html;
    }
    
}

// focus on card to the right
function focusNext(currentCard) {
    if (currentCard.nextElementSibling !== null) {
        currentCard.classList.remove('-focus');
        currentCard.nextElementSibling.classList.add('-focus');
        return currentCard.nextElementSibling;
    }
    return null;
}

// focus on card to the left
function focusPrev(currentCard) {
    if (currentCard.previousElementSibling !== null) {
        currentCard.classList.remove('-focus');
        currentCard.previousElementSibling.classList.add('-focus');
        return currentCard.previousElementSibling;
    }
    return null;
}

// focus on first card in the next collection
function focusDown(currentCategory, currentCard) {
    let nextCategory = currentCategory.nextElementSibling;
    if (nextCategory !== undefined) {
        let nextCategoryCards = nextCategory.getElementsByClassName('category-card');
        if (nextCategory.classList.contains('category') && nextCategoryCards.length > 0) {
            currentCategory.classList.remove('-currentCategory');
            currentCard.classList.remove('-focus');
            nextCategory.classList.add('-currentCategory');
            nextCategoryCards[0].classList.add('-focus');
            return nextCategory;
        }
    }
    return null;
}

// focus on first card in previous collection
function focusUp(currentCategory, currentCard) {
    let prevCategory = currentCategory.previousElementSibling;
    if (prevCategory !== undefined) {
        let prevCategoryCards = prevCategory.getElementsByClassName('category-card');
        if (prevCategory.classList.contains('category') && prevCategoryCards.length > 0) {
            currentCategory.classList.remove('-currentCategory');
            currentCard.classList.remove('-focus');
            prevCategory.classList.add('-currentCategory');
            prevCategoryCards[0].classList.add('-focus');
            return prevCategory;
        }
    }
    return null
}

async function main() {
    // get data
    let data = await getData();

    // display loaded elements
    displayCards(data);

    // place focus on first card
    document.getElementsByClassName('category')[0].classList.add('-currentCategory');
    document.getElementsByClassName('category-card')[0].classList.add('-focus');

    // handle controls left, right, up, down
    document.addEventListener("keydown", function(event) {
        let currentCard = document.getElementsByClassName('-focus')[0];
        let currentCategory = document.getElementsByClassName('-currentCategory')[0];

        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                let prevCat = focusUp(currentCategory, currentCard);
                if (prevCat) {
                    prevCat.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                let nextCat = focusDown(currentCategory, currentCard);
                if (nextCat) {
                    nextCat.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                let nextElement = focusNext(currentCard);
                if (nextElement) {
                    nextElement.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                let prevElement = focusPrev(currentCard);
                if (prevElement) {
                    prevElement.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                break;
            default:
              break;
          }
    });
    
}

main()