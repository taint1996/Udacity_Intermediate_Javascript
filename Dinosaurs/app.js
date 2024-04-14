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

      getRamdomFact() {
        const facts = [
          this.fact,
          `The ${this.species} lived in the ${this.where} Pediod`,
          `The ${this.species} was a ${this.diet} eater`,
          `The ${this.species} lived during the ${this.when}`,
          this.compareDiet(),
          this.compareHeight(),
          this.compareWeight()
        ];
        return facts[Math.floor(Math.random() * facts.length)];
      }

      // Create Dino Compare Method 1
      // NOTE: Weight in JSON file is in lbs, height in inches.
      compareWeight(humanWeight) {
        return `The ${this.species} is ${
          this.weight > humanWeight ? 'bigger' : 'smaller'
        } than you`;
      }
      // Create Dino Compare Method 2
      // NOTE: Height in JSON file is in lbs, height in inches.
      compareHeight(humanHeight) {
        return `The ${this.species} is ${
          this.height > humanHeight ? 'taller' : 'shorter'
        } than you`;
      }

      // Create Dino Compare Method 3
      // NOTE: Diet in JSON file is in lbs, height in inches.
      compareDiet(humanDiet) {
        return `Wow!. You and the ${this.species} are ${
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
      diet: '',
      setName: function (inpName) {
        this.name = inpName;
      },
      setWeight: function (inpWeight) {
        this.weight = inpWeight;
      },
      setHeight: function (inpHeight) {
        this.height = inpHeight;
      },
      setDiet: function (inpDiet) {
        this.diet = inpDiet;
      },
      setInches: function (inpInches) {
        this.inches = inpInches;
      }
    };

    // Generate Tiles for each Dino in Array
    const generateTitles = () => {
      const grid = document.getElementById('grid');
      const titles = dinos.map((dino) => {
        const tile = document.createElement('div');
        tile.classList.add('grid-item');

        tile.innerHTML = `
            <h3>The ${dino.species}</h3>
            <img src="./images/${dino.species.toString().toLowerCase()}.png" />
            <p>${dino.getRamdomFact()}</p>
        `;
        return tile;
      });

      // Add tiles to DOM
      // Add Human Title
      const createHumanTitle = document.createElement('div');
      createHumanTitle.classList.add('grid-item');
      createHumanTitle.innerHTML = `
    <h3>${Human.name}</h3>
    <img src="./images/human.png" alt="Human">
    <p>No facts available for humans
    </p>`;
      titles.splice(4, 0, createHumanTitle);

      grid.append(...titles);
    };

    // Remove form from screen
    const removeForm = () => {
      const form = document.getElementById('dino-compare');
      form.style.display = 'none';
    };

    const setHumanData = () => {
      const humanName = document.getElementById('name').value;
      const feet = parseInt(document.getElementById('height').value);
      const inches = parseInt(document.getElementById('inches').value);
      const humanHeight = feet * 12 + inches;
      const humanWeight = parseInt(document.getElementById('weight').value);
      const humanDiet = document.getElementById('diet').value;

      Human.setName(humanName);
      Human.setWeight(humanWeight);
      Human.setHeight(humanHeight);
      Human.setDiet(humanDiet);
    };

    // On button click, prepare and display infographic
    document
      .getElementById('btn-compare')
      .addEventListener('click', function () {
        setHumanData();
        removeForm();
        generateTitles();
      });
  });
