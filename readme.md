sockets 

//jab koi passenger login krega to create booking pe jayega to ekbooking crreate hogi
//jo by default peding state pe hogi aur uska driver null hoga 
//fir ek notification jaygi drivers ko ki ride is aviable , jo aas paas jhonge drivers

-> 1 passenger->login -> /createBooking -> booking created -> pending state->driver: null -> notify nearby drivers ko notification jayegi jo 5 km radius pe honge




//jab bhi koi ek driver login krega system mei 
//mtlb aviable hai bookings k liye
//to use liye alg se uska unique socke connection open hoga jiski unique id hogi
//agar 10 driver avaible hai to 10 uniq socket connection honge
driver login->avaible for bookins -> socket connection open


//let 4 drivers the
//1 one of them accepted the ride and it wil hit an confirm booking api for confirmation
-> 1 driver ->accepted the ride  -> -> /confirmebooking 

//booking confirmed hone k baad bookin removed hojaygi show hona baaki riders ko

2nd -> jis driver ne accept ki ride uski id /createBooking mei jo driver:null tha usme update hojaygi


//ek booking req aayi maano
//aur 3 drivers area mei the 
booking1 
dr [1,3,5]


redis mei in driver ki ids , booking ids k saath store karelnge , jab ek driver accept krelga ride ko , to jisne accept kari usko chorh k baakiyo se wo notifcaiotn remove kra denge booking ka 


