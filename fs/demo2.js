/**
 * 通过连接输入流和输出流的方式复制文件
 * node demo2.js demo0.txt demo2.txt
 */
var fs = require('fs');

function copy(src,dst){
	fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

/**
 * 使用流事件的方式实现复制方法
 */
function copyControllerByEvent(src,dst){
	var rs = fs.createReadStream(src);
	var ws = fs.createWriteStream(dst);
	//读入数据
	rs.on('data',function(chunk){
		//写入数据
		if(ws.write(chunk)===false){
			//写入数据异常，有可能读入流的速度比写入流的速度快，为防止读入流缓存被撑爆，此时应该停止读入
			console.log('rs pause');
			rs.pause();
		}
	});
	//读入结束
	rs.on('end',function(){
		//同时关闭写入流
		console.log('rs ws end');
		ws.end();
	});
	//写入完成
	ws.on('drain',function(){
		//重新启动读入流
		console.log('ws drain rs resume');
		rs.resume();
	});
}

function main(argv){
	copyControllerByEvent(argv[0],argv[1]);
}

console.log(process.argv);
var argv = process.argv.slice(2);
console.log(argv);
main(argv);