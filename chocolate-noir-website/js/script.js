// ====== EDIT THESE ======
const WHATSAPP_NUMBER = "923345641554"; // Hashir's number: 92 + 334 5641554
const PRODUCTS = [
  {id:"brownie", name:"Chocolate Brownie", price:200, img:"images/brownie.jpg",
   desc:"Fudgy, rich and palm-sized. Big enough to share (but you won't)."},
  {id:"cookie", name:"Chocolate Cookie", price:250, img:"images/cookie.jpg", photo:true,
   desc:"Thick, soft-centred cookie with melty chocolate chunks. Price per cookie."},
  {id:"wonka-cake", name:"Wonka Cake", price:2700, img:"images/wonka-cake.jpg",
   desc:"Rich, molten chocolate Wonka cake, baked fresh to order."}
];
// ========================

const cart = {};
const $ = id => document.getElementById(id);
const rs = n => "Rs " + n.toLocaleString();

$("yr").textContent = new Date().getFullYear();

$("products").innerHTML = PRODUCTS.map(p => `
  <div class="card">
    <div class="pic${p.photo?' photo':''}" ${p.photo?`style="--bg:url(${p.img})"`:''}><img src="${p.img}" alt="${p.name}"></div>
    <div class="info">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row">
        ${p.comingSoon
          ? '<span class="soon">Coming soon</span>'
          : `<span class="price">${rs(p.price)}</span>
             <button class="add" onclick="add('${p.id}')">Add to Cart</button>`}
      </div>
    </div>
  </div>`).join("");

function add(id){ cart[id] = (cart[id]||0) + 1; render(); openCart(); }
function change(id, d){ cart[id] += d; if(cart[id] <= 0) delete cart[id]; render(); }

function render(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,i)=>s+cart[i],0);
  const total = ids.reduce((s,i)=>s+cart[i]*PRODUCTS.find(p=>p.id===i).price,0);
  $("count").textContent = count;
  $("total").textContent = rs(total);
  $("checkout").style.display = count ? "block" : "none";
  $("items").innerHTML = count ? ids.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i);
    return `<div class="item">
      <div><b>${p.name}</b><br><small>${rs(p.price)} each</small></div>
      <div class="qty">
        <button onclick="change('${i}',-1)">−</button><span>${cart[i]}</span><button onclick="change('${i}',1)">+</button>
      </div></div>`;
  }).join("") : '<div class="empty">Your cart is empty 🍫</div>';
}

function openCart(){ $("drawer").classList.add("open"); $("overlay").classList.add("open"); }
function closeCart(){ $("drawer").classList.remove("open"); $("overlay").classList.remove("open"); }
$("openCart").onclick = openCart;
$("closeCart").onclick = closeCart;
$("overlay").onclick = closeCart;

$("checkoutBtn").onclick = () => {
  const name = $("name").value.trim();
  const phone = $("phone").value.trim();
  const address = $("address").value.trim();
  const err = $("err");
  if(!name) return err.textContent = "Please enter your name.";
  if(phone.replace(/\D/g,"").length < 10) return err.textContent = "Please enter a valid phone number.";
  if(address.length < 10) return err.textContent = "Please enter your full Lahore address.";
  err.textContent = "";

  const ids = Object.keys(cart);
  let total = 0;
  const lines = ids.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i);
    const sub = p.price*cart[i]; total += sub;
    return `• ${p.name} x${cart[i]} = ${rs(sub)}`;
  });
  const msg =
`🍫 *New Order - Chocolate Noir*

*Name:* ${name}
*Phone:* ${phone}
*Address:* ${address}, Lahore

*Items:*
${lines.join("\n")}

*Total:* ${rs(total)}
*Payment:* Cash on delivery`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};

render();
