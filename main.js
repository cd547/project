var container,//主容器
camera,//主摄像机
controls,//主方向控制器
scene,//主场景
renderer,//主渲染器
container2,//坐标放置容器
renderer2,//坐标轴所在场景渲染器
camera2,//观察坐标的摄像机
axes2,//三维坐标轴
scene2,//三维坐标轴场景
ambient,//环境光照
box,//模型边界
object,//载入模型
n,//模型的id
lx,//模型边界x方向上的长度
ly,//模型边界y方向上的长度
lz,//模型边界z方向上的长度
directionalLight,//直接光源，主光源
gridon = true,//网格平面显示的使能
material,//物体的材质
loaded = 0,//物体当前载入的百分比0-100
text1,//主标题下第一行的节点
text2,//主标题下第二行的节点
text3,//主标题下第三行的节点
enable,//定时更新标志
source,
isfirst=true,
loadedobj=null,
i = 1;//模型文件名编号


init();
animate();

function init() {
//显示x长度
    text1 = document.createElement('a');
    text1.setAttribute("id", "a2");
    text1.style.cssText ="position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:35px;right:10px;font:12px arial,sans-serif;float:right;";
    document.body.appendChild(text1);
//显示y长度
    text2 = document.createElement('a');
    text2.setAttribute("id", "a3");
    text2.style.cssText ="position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:50px;right:10px;font:12px arial,sans-serif;float:right;";
    document.body.appendChild(text2);
//显示z长度
    text3 = document.createElement('a');
    text3.setAttribute("id", "a4");
    text3.style.cssText ="position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:65px;right:10px;font:12px arial,sans-serif;float:right;";
    document.body.appendChild(text3);
//设置主摄像机透视视角及参数
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-50,50,0);
//实例化2个场景
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
//环境光
    ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);
//投射光
    directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(-50,50,0);
    scene.add(directionalLight);
//网格设置
    var helper = new THREE.GridHelper(200, 10);
    helper.setColors(0x235880, 0x808080);
    helper.position.y = 0;
    scene.add(helper);
// SKYDOME
/*
var vertexShader = document.getElementById( 'vertexShader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
var uniforms = {
topColor: { type: "c", value: new THREE.Color(0x8ACEFF) },
bottomColor: { type: "c", value: new THREE.Color( 0x555555 ) },
offset:		 { type: "f", value: 400 },
exponent:	 { type: "f", value: 0.6 }
};
uniforms.topColor.value.copy( light.color );

var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
var skyMat = new THREE.ShaderMaterial( {
uniforms: uniforms,
vertexShader: vertexShader,
fragmentShader: fragmentShader,
side: THREE.BackSide
} );

var sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );
*/
//定义材质
    material = new THREE.MeshPhongMaterial({ color: 0x996633, emissive: 0x111111, shading: THREE.FlatShading });
//载入模型
//loadmodel();
//定时载入模型
//enable = window.setInterval("updatemodel()", 1000); //每隔一秒执行一次 loadmodel(material);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x212121);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 4 / 6, window.innerHeight * 4 / 6);
renderer.shadowMap.enabled = true;
renderer.domElement.id = "main3d";
renderer.domElement.setAttribute('class', 'main3ddisable');
container = document.getElementById('main');
container.appendChild(renderer.domElement);
var maintitle = document.createElement('div');
maintitle.id = "maintitle";
container.appendChild(maintitle);
$("#maintitle").attr("class", "maintitle");
maintitle.innerHTML="无人料场";
container.appendChild(renderer.domElement);
var mainctrl = document.createElement('div');
mainctrl.id = "mainctrl";
container.appendChild(mainctrl);
$("#mainctrl").css({
    "position": "absolute","float":"right","border-color":"#47dcdb","border-width":"2px","border-style":"solid","left":"33%","background-color":"#09212B","width":"66.3%",
    "height": "40px", "padding-left": "5px", "top": (32 + window.innerHeight * 4 / 6) + "px"
});
mainctrl.innerHTML = "<div style=\"border:1px solid #47dcdb;height:26px;width:86px;margin:5px;float:left;\"><a href='javascript:void(0);' class='normal' onclick=\"startplay()\" id='start'>开始</a></div>"+
 "<div style=\"border:1px solid #47dcdb;height:26px;width:86px;margin:5px;float:left;\"><a href='javascript:void(0);' class='disable' onclick=\"stopplay()\" id='stop'>停止</a></div>"+
"<div style=\"border:1px solid #47dcdb;height:26px;width:86px;margin:5px;float:left;\"><a href='javascript:void(0);' class='normal' onclick=\"ambienton()\" id='ambient'>环境光</a></div>"+
 "<div style=\"border:1px solid #0A8E83;height:4px;width:100px;margin:5px;float:left;padding:1px;\"><div id=\"loadedstat\" style=\"height:4px;width:100px;background-color:#47dcdb;\"></div></div><div id=\"loadednum\"></div>";
// Controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.damping = 0.2;
controls.addEventListener('change', render);
transformControl = new THREE.TransformControls(camera, renderer.domElement);
transformControl.addEventListener('change', render);
scene.add(transformControl);
setupInset();

//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//
window.addEventListener('resize', onWindowResize, false);
document.onkeydown = function (event) {
var e = event || window.event || arguments.callee.caller.arguments[0];
if (e && e.keyCode == 71) { // 按 G
//显示网格
if (gridon) {
scene.remove(helper); gridon = false;
}
else { scene.add(helper); gridon = true; }
}
if (e && e.keyCode == 82) { // 按 R
//视角重置
camera.position.set(-50, 50, 0);
}
};
}


            function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth * 4 / 6, window.innerHeight * 4 / 6);
            $("#mainctrl").css({
                "position": "absolute", "float": "right", "border-color": "#47dcdb", "border-width": "2px", "border-style": "solid", "left": "33%", "background-color": "#09212B", "width": "66.3%",
                "height": "40px", "padding-left": "5px", "top": (32+ window.innerHeight * 4 / 6) + "px"
            });
            }

            function animate() {
                requestAnimationFrame(animate);
            controls.update();
            //copy position of the camera into inset
            camera2.position.copy(camera.position);
            camera2.position.sub(controls.target);
            camera2.position.setLength(280);
            camera2.lookAt(scene2.position);
            renderer.render(scene, camera);
            renderer2.render(scene2, camera2);
            var div1 = document.getElementById('loadedstat');
            div1.style.width = loaded + "px";
            $("#loadednum").html(loaded+"%");
            //controls.update();
            //transformControl.update();
            }

            function render() {
                //camera.lookAt( scene.position );
                renderer.render(scene, camera);
            }

            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {
                console.log(item, loaded, total);
     				};

            function onProgress(xhr) {
            if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
            loaded = Math.round(percentComplete, 2);
            }
            }

            function onError(xhr) { }

            function loadmodel() {
            var loader = new THREE.OBJLoader(manager);
            loader.load('../obj/data'  + i + '.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
            child.material = material;//model material
            child.material.side = THREE.DoubleSide;
            }
            });
            object.rotateX(-Math.PI / 2);
            object.position.set(-25, 0, 40);
            scene.add(object);
           // alert('c' + object.id);

            box = new THREE.BoxHelper(object);
            scene.add(box);
            var maxx = box.geometry.attributes.position.array[0];
            var minx = box.geometry.attributes.position.array[3];
            lx = Math.abs(maxx - minx);
            var maxy = box.geometry.attributes.position.array[1];
            var miny = box.geometry.attributes.position.array[10];
            ly = Math.abs(maxy - miny);
            var maxz = box.geometry.attributes.position.array[2];
            var minz = box.geometry.attributes.position.array[14];
            lz = Math.abs(maxz - minz);
            text1.innerHTML = "X=" + lx.toFixed(2);
            text2.innerHTML = "Y=" + ly.toFixed(2);
            text3.innerHTML = "Z=" + lz.toFixed(2);
                text1.style.cssText =
                "position:absolute;width:300;height:200;color:#47dcdb;top:35px;right:10px;font:12px arial,sans-serif;float:right;";
                text2.style.cssText =
                "position:absolute;width:300;height:200;color:#47dcdb;top:50px;right:10px;font:12px arial,sans-serif;float:right;";
                text3.style.cssText =
                "position:absolute;width:300;height:200;color:#47dcdb;top:65px;right:10px;font:12px arial,sans-serif;float:right;";
                
            n = object.id;
            }, onProgress, onError); i++;
            }

            function updatemodel(objname) {
                        var loader = new THREE.OBJLoader(manager);
                        loader.load('../obj/' + objname , function (object) {
                            object.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    child.material = material;//model material
                                    child.material.side = THREE.DoubleSide;
                                }
                            });
  
                            object.rotateX(-Math.PI / 2);
                            object.position.set(-25, 0, 40);
                            //object.needsUpdate = true;
                            if(isfirst)
                            {
                            	  scene.add(object);
                                  // alert('c' + object.id);

                                   box = new THREE.BoxHelper(object);
                                   scene.add(box);
                                   var maxx = box.geometry.attributes.position.array[0];
                                   var minx = box.geometry.attributes.position.array[3];
                                   lx = Math.abs(maxx - minx);
                                   var maxy = box.geometry.attributes.position.array[1];
                                   var miny = box.geometry.attributes.position.array[10];
                                   ly = Math.abs(maxy - miny);
                                   var maxz = box.geometry.attributes.position.array[2];
                                   var minz = box.geometry.attributes.position.array[14];
                                   lz = Math.abs(maxz - minz);
                                   text1.innerHTML = "X=" + lx.toFixed(2);
                                   text2.innerHTML = "Y=" + ly.toFixed(2);
                                   text3.innerHTML = "Z=" + lz.toFixed(2);
                                       text1.style.cssText =
                                       "position:absolute;width:300;height:200;color:#47dcdb;top:35px;right:10px;font:12px arial,sans-serif;float:right;";
                                       text2.style.cssText =
                                       "position:absolute;width:300;height:200;color:#47dcdb;top:50px;right:10px;font:12px arial,sans-serif;float:right;";
                                       text3.style.cssText =
                                       "position:absolute;width:300;height:200;color:#47dcdb;top:65px;right:10px;font:12px arial,sans-serif;float:right;";
                                   n = object.id;
                            	isfirst=false;
                            }
                            else
                            {
                            	box.geometry.dispose();
                                box.material.dispose();
                                scene.remove(box);
                                //alert("d" + n);
                                scene.getObjectById(n).children[0].geometry.dispose();
                                scene.getObjectById(n).children[0].material.dispose();
                                scene.remove(scene.getObjectById(n));
                                scene.add(object);
                                box = new THREE.BoxHelper(object);
                                scene.add(box);
                                // alert('c' + object.id);
                                var maxx = box.geometry.attributes.position.array[0];
                                var minx = box.geometry.attributes.position.array[3];
                                lx = Math.abs(maxx - minx);
                                var maxy = box.geometry.attributes.position.array[1];
                                var miny = box.geometry.attributes.position.array[10];
                                ly = Math.abs(maxy - miny);
                                var maxz = box.geometry.attributes.position.array[2];
                                var minz = box.geometry.attributes.position.array[14];
                                lz = Math.abs(maxz - minz);
                                text1.innerHTML = "X=" + lx.toFixed(2);
                                text2.innerHTML = "Y=" + ly.toFixed(2);
                                text3.innerHTML = "Z=" + lz.toFixed(2);
                                n = object.id;
                            }
                        }, onProgress, onError); i++;


                }

            function stop()
            {
               // window.clearInterval(enable);
            	source.close();
                enable = null;
                    text1.style.cssText =
                    "position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:35px;right:10px;font:12px arial,sans-serif;float:right;";
                    text2.style.cssText =
                    "position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:50px;right:10px;font:12px arial,sans-serif;float:right;";
                    text3.style.cssText =
                    "position:absolute;width:300;height:200;color:rgba(255,255,255,0.5);top:65px;right:10px;font:12px arial,sans-serif;float:right;";
            }
          
            function play()
            {
                 //window.clearInterval(enable);
                 if(typeof(EventSource)!=="undefined")
         		{
                	 source=new EventSource('/OA/message/showtime');
         			source.onmessage = function(e) {
         				if(e.data!=null)
         					{
         						if(e.data!=loadedobj)
         						{
         							updatemodel(e.data);
         							loadedobj=e.data;
         						}
         						
         						enable="1";
         					}
         			    }
         			source.addEventListener('message', function(e) {
         				  console.log(e.data);
         				}, false);

         				source.addEventListener('open', function(e) {
         					console.log("connected");
         				}, false);

         				source.addEventListener('error', function(e) {
         				  if (e.readyState == EventSource.CLOSED) {
         					  console.log("closed");
         				  }
         				}, false);
         			}
         			else
         			{
         				alert("Sorry, your browser does not support server-sent events...");
         			}
                // enable = window.setInterval("updatemodel()", 2000);
                    text1.style.cssText =
                    "position:absolute;width:300;height:200;color:#47dcdb;top:35px;right:10px;font:12px arial,sans-serif;float:right;";
                    text2.style.cssText =
                    "position:absolute;width:300;height:200;color:#47dcdb;top:50px;right:10px;font:12px arial,sans-serif;float:right;";
                    text3.style.cssText =
                    "position:absolute;width:300;height:200;color:#47dcdb;top:65px;right:10px;font:12px arial,sans-serif;float:right;";


            }

            function ambienton()
            {
                if (ambient.visible)
                {
                    ambient.visible = false;
                    $('#ambient').prop("class", "disable");
                }
                else
                {
                    ambient.visible = true;
                    $('#ambient').prop("class", "normal");
                }
            }

            function loaddlj() {
            var material = new THREE.MeshPhongMaterial({ color: 0xaa0000, emissive: 0x101010, shading: THREE.FlatShading });
            var loader = new THREE.OBJLoader();
            loader.load('box.obj', function (object1) {
            object1.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
            child.material = material;//model material
            child.material.side = THREE.DoubleSide;
            }
            });
            object1.position.set(0, 0, 0);
            object1.rotateX(-Math.PI / 2);
            object1.rotateZ(-Math.PI);
            scene.add(object1);
            box = new THREE.BoxHelper(object1);
            scene.add(box);

            });
            }
            //3d字体
            function loadtext(text,x,y,z,rx,ry,rz)
            {
            //text
            var loader = new THREE.FontLoader();
            loader.load('fonts/helvetiker_regular.typeface.js', function (font) {
            var textGeo = new THREE.TextGeometry(text, {
            font: font,
            size: 2,
            height: 0.01,
            curveSegments: 1,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelEnabled: true
            });
            var textMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
            var mesh = new THREE.Mesh(textGeo, textMaterial);
            if (rx)
            mesh.rotateX(-Math.PI / 2);
            if(ry)
            mesh.rotateY(-Math.PI / 2);
            if (rz)
            mesh.rotateZ(-Math.PI / 2);
            mesh.position.set(x, y, z);
            scene.add(mesh);
            });
            }
            //坐标轴
            function setupInset() {
            container2 = document.createElement('div');
            container.appendChild(container2);
            var insetWidth = 150, insetHeight = 90;
            container2.id='aux';
            container2.width = insetWidth;
            container2.height = insetHeight;
            // renderer
            renderer2 = new THREE.WebGLRenderer({ alpha: true });//必须true
            renderer2.setClearColor(0x000000, 0);
            renderer2.setSize(insetWidth, insetHeight);
            renderer2.domElement.id = "aux3d";
            container2.appendChild(renderer2.domElement);
            // scene
            scene2 = new THREE.Scene();
            // camera
            camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            camera2.up = camera.up; // important!
            // axes
            axes2 = new THREE.AxisHelper(100);
            scene2.add(axes2);
            }