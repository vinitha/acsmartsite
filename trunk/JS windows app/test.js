//usage: jsc test.js to generte a .exe file

import System.Windows.Forms; // this has a MessageBox class

function say() {
    var d = new Date();
    var n = Math.random();
    return 'Hello, \ntoday is ' + d + '\nand this is random - ' + n;
}

var ale={
    alert:function(msg,title){
        MessageBox.Show(
                msg,
                title||"Alert!",
                MessageBoxButtons.OK,
                MessageBoxIcon.Exclamation
        )        
    }
}


ale.alert("This is a message Box","messageBox title!");
