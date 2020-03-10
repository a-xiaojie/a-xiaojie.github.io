var goalAmount=2400; //最高值
var currentAmount=0; //当前数值
var animationTime=500; //动画时间
var oHeight=0;


$(function(){
	oHeight=$('.m-meter-bg').height();
	generateNum();
	animateMeter();
	setInterval(function(){
		generateNum();
		animateMeter();
	},5000);
});

function generateNum(){
	/*currentAmount=Math.round(Math.random()*2000)*/
	currentAmount+=100;
}

function animateMeter(){
	var per=currentAmount/goalAmount;
	var mercuryHeight=Math.round((oHeight-8)*per);
	var newMercuryTop=oHeight-mercuryHeight;
	if(currentAmount > goalAmount){
		newMercuryTop=0;
		mercuryHeight=oHeight-8;
	}
	else{
		if(currentAmount<400){
			$('.m-meter-mercury').removeClass('red orange').addClass('green');
		}
		else if(currentAmount>=400 && currentAmount<1400){
			$('.m-meter-mercury').removeClass('red green').addClass('orange');
		}
		else if( currentAmount>=1400){
			$('.m-meter-mercury').removeClass('green orange').addClass('red');
		}
	}
	$('.m-meter-mercury').animate({height:mercuryHeight }, animationTime);
	$('.m-meter-tips').animate({top:newMercuryTop-7},{duration:animationTime});
	$('.m-meter-tips').text('当前 '+currentAmount);

}