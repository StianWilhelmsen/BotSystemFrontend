<template>
  <div class="list-container">
    <ul>
      <li>
        <strong>Uforberedt:</strong> Møte opp til vors uten å følge temaet som
        er satt
      </li>
      <br />
      <li><strong>Idiotiske utsagn:</strong> Alt dumt en person sier.</li>
      <br />
      <li><strong>Klovn:</strong> En person oppfører seg klovnete.</li>
      <br />
      <li><strong>Jantelov:</strong> Ikke tro at du er noe</li>
      <br />
      <li><strong>Karo-paragrafen:</strong> Ikke fullføre lambo</li>
      <br />
      <li>
        <strong>Jarand-paragrafen:</strong> Komme mer enn en halvtime for sent –
        1 bot per 30 minutt
      </li>
      <br />
      <li>
        <strong>Tease-paragraf:</strong> Si du kommer men kommer ikke på
        arrangementet | 5 (Hvis de gir beskjed under en time før – 3 bøter – 24
        timer før ingen bøter)
      </li>
      <br />
      <li>
        <strong>To be named:</strong> kommer ikke inn på utested (2 bøter)
      </li>
      <br />
      <li>
        <strong>Kastet ut:</strong> Bot for å bli kastet ut av utested (1 bot)
      </li>
      <br />
      <li>
        <strong>Karo-kok paragraf:</strong> Gå hjem fra vors/fest før 23:00. (2
        bøter)
      </li>
      <br />
      <li><strong>Syvsoveren:</strong> Sovne på vors (2 bøter)</li>
      <br />
      <li>
        <strong>Grisen:</strong> Tilgrising av festområdet (1-5 tas med skjønn)
      </li>
      <br />
      <li><strong>Oppkast:</strong> Spy på fest (1 bot)</li>
      <br />
      <li>
        <strong>Bomben:</strong> Hvis vedkommende treffer bomben i beer pong så
        kan personen dele ut 1 bot til en på motstanderlaget.
      </li>
      <br />
      <li>
        <strong>Hosten:</strong> Host kan dele ut 2 bøter (Helst noen som ikke
        møtte opp)
      </li>
      <br />
      <li>
        <strong>Snill-gutt:</strong> Hvis videkommende ikke har 8 bøter, så
        rundes det opp til 8 bøter.
      </li>
      <br />
      <li>
        <strong>Ekstraordinær Hendelse:</strong> Alt annet som ikke dekkes av
        lovverket.
      </li>
      <br />
      <li>
        <strong>Folkeskikk:</strong> Hvis en av gutta oppfører seg ugutta.
      </li>
      <br />
      <li><strong>Strykeren:</strong> Strøyk på en eksamen (3 bøter)</li>
      <br />
      <li><strong>Incel:</strong> Hvis man ikke registerer oppmøte (1 bot)</li>
      <br />
      <li>
        <strong>Snylteren:</strong> Spørre om drikken sin 2 dager etter festen.
      </li>
      <br />
      <li>
        <strong>Slem gutt:</strong> Personen med flest bøter får dele ut 10
        bøter til kommende botfest etter endt rettsak.
      </li>
      <br />
      <li>
        <strong>Skjellevik-paragrafen:</strong> Upassende musikk på vors (antall
        bøter utifra hvor dritt sangen er)
      </li>
      <br />
      <li>
        <strong>Eirik-paragrafen:</strong> Overdreven ikke-diskré tafsing på en
        person. (2-4 bøter utifra hvor grov tafsingen er)
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-container {
  padding: 10px;
  width: 90%;
}

.list-container ul {
  list-style-type: none;
  padding: 0;
}

.list-container li {
  margin-bottom: 10px;
  text-align: left;
}
</style>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const fineTypes = ref([]);
    const apiPort = ref(import.meta.env.VITE_API_KEY);

    onMounted(() => {});

    return {
      fineTypes,
    };
  },
};
</script>
