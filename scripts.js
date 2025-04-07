// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBrvZ9tZD5M-n3X-2lJXyV6C_qK4w4TLMQ",
    authDomain: "forest-8fcf9.firebaseapp.com",
    projectId: "forest-8fcf9",
    storageBucket: "forest-8fcf9.appspot.com",
    messagingSenderId: "435012597352",
    appId: "1:435012597352:web:e5a5534e0646891194addd",
    measurementId: "G-5GQHJ7NJBF",
    databaseURL: "https://forest-8fcf9-default-rtdb.firebaseio.com"  // Обновленный URL
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  const form = document.getElementById('bet-form');
  const list = document.getElementById('bet-list');
  const totalBankElement = document.getElementById('total-bank');
  const prizeFundElement = document.getElementById('prize-fund');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const choice = document.getElementById('choice').value;
    if (!name) return;
  
    const bet = { name, choice, amount: 5 };  // Ставка 5₽
    db.ref("bets").push(bet).then(() => {
      form.reset();
      loadBets();
    });
  });
  
  function loadBets() {
    db.ref("bets").once("value").then(snapshot => {
      const data = snapshot.val() || {};
      const grouped = {};
      let totalBank = 0;
  
      Object.entries(data).forEach(([id, bet]) => {
        const key = bet.name + "-" + bet.choice;
        if (!grouped[key]) {
          grouped[key] = { ...bet, count: 0, ids: [] };
        }
        grouped[key].count += 1;
        grouped[key].ids.push(id);
        totalBank += bet.amount;
      });
  
      // Обновление информации о банке и призовом фонде
      totalBankElement.textContent = `${totalBank} BYN`;
      const prizeFund = totalBank * 0.5;
      prizeFundElement.textContent = `${prizeFund} BYN`;
  
      // Если есть ставки, то отображаем их
      list.replaceChildren();
      Object.values(grouped).forEach(bet => {
        const div = document.createElement('div');
        div.className = 'bet-item';
        div.innerHTML = `
          <span>${bet.name} — <strong>${bet.choice}</strong> (${bet.count})</span>
          <button class="delete-btn">Удалить</button>
        `;
        div.querySelector('.delete-btn').onclick = () => {
          bet.ids.forEach(id => db.ref("bets/" + id).remove());
          loadBets();
        };
        list.appendChild(div);
      });
    });
  }
  
  loadBets();
  
  // Модальное окно
  const rulesBtn = document.getElementById('rules-btn');
  const rulesModal = document.getElementById('rules-modal');
  const closeRules = document.getElementById('close-rules');
  
  rulesBtn.addEventListener('click', () => {
    rulesModal.style.display = 'flex';
  });
  
  closeRules.addEventListener('click', () => {
    rulesModal.style.display = 'none';
  });
  
  rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) rulesModal.style.display = 'none';
  });
  