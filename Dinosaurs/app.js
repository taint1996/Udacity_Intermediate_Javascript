// Create Dino Objects
fetch('./dino.json')
  .then((response) => response.json())
  .then((data) => {
    // Create Dino Constructor
    class Dino {
      constructor({ species, weight, height, diet, where, when, fact }) {
        Object.assign(this, {
          species,
          weight,
          height,
          diet,
          where,
          when,
          fact
        });
      }

      // Create Dino Compare Method 1
      // NOTE: Weight in JSON file is in lbs, height in inches.
      compareWeight(humanWeight) {
        return `${this.species} is ${
          this.weight > humanWeight ? 'bigger' : 'smaller'
        } than you`;
      }
      // Create Dino Compare Method 2
      // NOTE: Height in JSON file is in lbs, height in inches.
      compareHeight(humanHeight) {
        return `${this.species} is ${
          this.height > humanHeight ? 'taller' : 'shorter'
        } than you`;
      }

      // Create Dino Compare Method 3
      // NOTE: Diet in JSON file is in lbs, height in inches.
      compareDiet(humanDiet) {
        return `Wow!. You and ${this.species} are ${
          this.diet === humanDiet ? 'same' : 'different'
        } diet.`;
      }
    }

    const { Dinos } = data;
    const dinos = Dinos.map((dino) => {
      return new Dino(dino);
    });
    return dinos;
  })
  .then((dinos) => {
    // Create Human Object
    const Human = {
      name: '',
      weight: 0,
      height: 0,
      inches: 0,
      setName: function (inpName) {
        this.name = inpName;
      },
      setWeight: function (inpWeight) {
        this.weight = inpWeight;
      },
      setHeight: function (inpHeight) {
        this.height = inpHeight;
      },
      setInches: function (inpInch) {
        this.inches = inpInch;
      }
    };

    // Generate Tiles for each Dino in Array
    const generateTitles = () => {
      const grid = document.getElementById('grid');
      const titles = dinos.map((dino) => {
        const tile = document.createElement('div');
        tile.classList.add('grid-item');
        tile.innerHTML = `
            <h3>${dino.species}</h3>
            <p>${dino.fact}</p>
            <p>${dino.compareWeight(Human.weight)}</p>
            <p>${dino.compareHeight(Human.height)}</p>
            <p>${dino.compareDiet(Human.diet)}</p>
        `;
        return tile;
      });
      grid.append(...titles);
    };

    // Add tiles to DOM
    // Remove form from screen
    const removeForm = () => {
      const form = document.getElementById('dino-compare');
      form.style.display = 'none';
    };

    // On button click, prepare and display infographic
    document
      .getElementById('btn-compare')
      .addEventListener('click', function () {
        const humanName = document.getElementById('name').value;
        const humanWeight = parseInt(document.getElementById('weight').value);
        const humanHeight = parseInt(document.getElementById('height').value);

        Human.setName(humanName);
        Human.setWeight(humanWeight);
        Human.setHeight(humanHeight);

        removeForm();
        generateTitles();
      });
  });
