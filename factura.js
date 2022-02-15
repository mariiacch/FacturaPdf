var url= window.location.href;
var swLocation = '/FacturaPdf/sw.js'

// registro el service worker

if(navigator.serviceWorker){
    if(url.includes('localhost')){
        swLocation='/sw.js'
    }
    navigator.serviceWorker.register(swLocation)
}

//cabecera:
const inputNombre= document.getElementById("inputNombre")
const inputRuc= document.getElementById("inputRuc")
const inputNroControl= document.getElementById("inputNroControl")
const inputNroGuia= document.getElementById("inputNroGuia")
const inputDireccion= document.getElementById("inputDireccion")
const inputFecha= document.getElementById("inputFecha")
const pago= document.getElementById('pago');
const inputLicencia= document.getElementById('inputLicencia')


const formCabecera= document.getElementById("formCabecera")
//********************************************************/

//cuerpo de la factura:


const formDetalle = document.getElementById("formDetalle")
const inputProducto=document.getElementById('inputProducto')
const inputFabricante=document.getElementById('inputFabricante')
const inputCajas=document.getElementById('inputCajas')
const inputUnidades=document.getElementById('inputUnidades')
const inputCapacidad=document.getElementById('inputCapacidad')
const inputVolumen=document.getElementById('inputVolumen')
const inputGrado=document.getElementById('inputGrado')
const procedencia=document.getElementById('procedencia')
const precioUnitario=document.getElementById('precioUnitario')
const inputPTotal=document.getElementById("precioTotal")
const cuerpoTabla=document.getElementById("cuerpoTabla")
const resetRegistro=document.getElementById('resetRegistro');

const SubtotalFactura=document.getElementById('SubtotalFactura')
const ExoneradototalFactura=document.getElementById('ExoneradototalFactura');

const conductor=document.getElementById('conductor');
const ciConductor=document.getElementById('ciConductor');
const placa= document.getElementById('placa');
const tipoVehiculo=document.getElementById('tipoVehiculo');

const btnGuardar=document.getElementById("btnGuardar")




const btnGenerarPdf= document.getElementById('btnGenerarPdf');
const eliminarNodo= document.getElementById('eliminarNodo');

//boton de totalizar:
const totalizarFact= document.getElementById("totalizarFact")

//input del total:
const totalFactura= document.getElementById("totalFactura")

//hare un arreglo vacio para guardar los totales:
totalesFact=[];



let facturas=[];



    const verificarFacturasLocalStorage=()=>{
        const facturasLS= JSON.parse(localStorage.getItem("facturas"));
       
        //if(facturasLS){
         //   facturas= facturasLS;
       // }

        //forma 2 
        facturas = facturasLS || [];
        
    }

    verificarFacturasLocalStorage();




    let arregloDetalle=[];

//se supone que cada vez que yo presione "agregar"
//al mandar el submit debe agregarse el producto al arreglo detalle vacio

//cada vez que haga un submit se crea un obj con toda la info que se va a pasar al arregloDetalle[]




const redibujarTabla=()=>{

        cuerpoTabla.innerHTML="";

       arregloDetalle.forEach((detalle)=>{
        let fila= document.createElement("tr");
        fila.innerHTML=
        `
        <td>${detalle.producto}</td>
        <td>${detalle.fabricante}</td>
        <td>${detalle.cajas}</td>
        <td>${detalle.unidades}</td>
        <td>${detalle.capacidad}</td>
        <td>${detalle.volumen}</td>
        <td>${detalle.grado}</td>
        <td>${detalle.procedencia}</td>
        <td>${detalle.precioUnitario}</td>
        <td>${detalle.pTotal}</td>
       
        

        `
       
        cuerpoTabla.appendChild(fila);
        
        
    })
}


const agregarDetalle=(objDetalle)=>{
    //buscar si el objeto detalle ya existia en el arregloDetalle
    
    const resultado =arregloDetalle.find((detalle)=>{
    if(+objDetalle.producto=== +detalle.producto){
        return detalle
}
})
//de ser asi, sumar la cantidad para que solo aparezca una vez en el arreglo:
    if(resultado){

        //del objDetalle voy a extraer el id  y 
        //voy a buscar en el arregloDetalle si es que tengo ya ese id
    //usare map ya que con el puedo recorrer y modificar al nuevo arreglo que retorna


    arregloDetalle= arregloDetalle.map((detalle)=>{
        //si existe el objd detalle retorno la modificacion
        if(+detalle.producto === +objDetalle.producto){
            return{
                cajas:+detalle.cajas + +objDetalle.cajas,
                unidades:+detalle.unidades + objDetalle.unidades,
                producto:detalle.producto,
                pTotal:(+detalle.cant + +objDetalle.cant) * +detalle.pUnit,
                //pUnit:+detalle.pUnit
            }
        }
        //si no, retorno el detalle como esta
        return detalle;
    })
        
    } else{
        arregloDetalle.push(objDetalle);
      
    }


}

formDetalle.onsubmit=(e)=>{
    e.preventDefault();
    //creando obj detalle:
    const objDetalle={
        producto:inputProducto.value,
        fabricante:inputFabricante.value,
        cajas:inputCajas.value,
        unidades:inputUnidades.value,
        capacidad:inputCapacidad.value,
        volumen:inputVolumen.value,
        grado:inputGrado.value,
        procedencia:procedencia.value,
        precioUnitario:precioUnitario.value,
        pTotal:inputPTotal.value 
    }
    
    agregarDetalle(objDetalle);
    console.log(arregloDetalle);
    redibujarTabla();
   
    //obtener los totales del obj
    totalesFact.push([inputPTotal.value]);
    console.log(`total almacenado: ${totalesFact}`)
    
  
   //recorrerlos y sumarlos 
   let total=0;
   for (let i=0; i<totalesFact.length;++i ){
       total += parseInt(totalesFact[i]);
       console.log(`el total del bucle es: ${total}`);
   }
    //console.log(`recorrido de obj: ${sumaTotales}`)

    //En la facturaTotales le paso como parametro la suma de mis totales para mostrar el resultado en mi factura 
    FacturaTotales(total)

}

    FacturaTotales=(total)=>{
        console.log(`hola soy la funcion factura Total y el total acumulado es de: ${total}`)
        totalFactura.value=total;
        SubtotalFactura.value=total;
        ExoneradototalFactura.value=total;


}

//boton reset registro del producto:
resetRegistro.onclick=()=>{
    formDetalle.reset();
    
}


btnGuardar.onclick=()=>{

    
    //crear el obj de la cabecera de la factura
    let objFactura={
        nombre:inputNombre.value,
        direccion:inputDireccion.value,
        fecha:inputFecha.value,
        nroControl:inputNroControl.value,
        nroGuia:inputNroGuia.value,
        pago:pago.value,
        licencia:inputLicencia.value,
        ruc:inputRuc.value,
        detalle:arregloDetalle,
    }

    console.log(objFactura)

    facturas.push(objFactura);
    //limpiar campos 
    formCabecera.reset();
    formDetalle.reset();
    //guardarlo en el localStorage
    localStorage.setItem("facturas",JSON.stringify(facturas))
    //borrar del tbody
    arregloDetalle=[];
    redibujarTabla();
    //calcularTotal();
}



// el "+" antes de inputCantidad transforma a entero
//toFixed(2) para redondear el total a dos decimales
const calcularTotalProducto=()=>{
    const cantidadCajas = +inputCajas.value;
    
    if(cantidadCajas === 0){
        inputUnidades.value=inputUnidades.value;
    }  else if(cantidadCajas === 1) {
        inputUnidades.value=(+cantidadCajas*12).toFixed(2);
    } else{
        inputUnidades.value=+cantidadCajas*12;
    }

   // const pUnit= +inputPUnitario.value;
    //const total= cantidad*pUnit;
    //inputPTotal.value= total.toFixed(2);

}

//funcion de prueba para eliminar nodo del navegador ::



eliminarNodo.onclick=()=>{
    console.log('eliminando...')
    //borrar del tbody
    arregloDetalle=[];
    redibujarTabla();
    
}


//calcular volumen total de los litros:
const calcularVolumenTotal=()=>{
    const capacidad = +inputCapacidad.value;
    const unidades= +inputUnidades.value;

    if(unidades=== 0){
        inputVolumen.value=inputVolumen.value;
    } else if(capacidad==1000){
        inputVolumen.value=capacidad*inputUnidades.value;
    } else{
        inputVolumen.value=capacidad*inputUnidades.value;
    }
}

//calcular precio total por productos agregados:
const calcularprecioTotalporProducto=()=>{
    //const precioTotal= +inputPTotal.value;
    //const unidades= +inputUnidades.value;
    inputPTotal.value=(precioUnitario.value) * +inputUnidades.value;
}

//cada vez que el usuario presione la tecla (onkeyup) haz la funcion de calcularTotal()
inputUnidades.onkeyup=()=>{
//calcularTotal();

}
precioUnitario.onchange=()=>{
    console.log('input precio unitario')
    calcularprecioTotalporProducto();
}

inputCapacidad.onchange=()=>{
    console.log("onchange de input capacidad")
    calcularVolumenTotal();

}

//cada vez que cambie el estado onchange tambien:

inputCajas.onchange=()=>{
    console.log("onchange de input unidades")
    calcularTotalProducto();
    calcularVolumenTotal();
    
    }


//para leer la img del formulario es con la siguiente funcion:

function loadImage(url){
    return new Promise(resolve=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType='blob';
        xhr.onload= function(e){
            const reader= new FileReader();
            reader.onload= function(event){
                const res= event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();

    })
}


btnGenerarPdf.onclick=()=>{
    
console.log('probando...')

//e.preventDefault();
    //capturo los datos del formulario :
    //nombre:
   const inputNombre= document.getElementById("inputNombre").value;

   const inputRuc= document.getElementById("inputRuc").value;
  
   const inputNroGuia= document.getElementById("inputNroGuia").value;

   const inputNroControl= document.getElementById("inputNroControl").value;

    const inputDireccion= document.getElementById("inputDireccion").value;
    
    const inputFecha= document.getElementById("inputFecha").value;

    const inputLicencia= document.getElementById('inputLicencia').value;

   const pago= document.getElementById('pago').value;

   const totalFactura= document.getElementById("totalFactura").value;

   const SubtotalFactura=document.getElementById('SubtotalFactura').value;
const ExoneradototalFactura=document.getElementById('ExoneradototalFactura').value;

const conductor=document.getElementById('conductor').value;
const ciConductor=document.getElementById('ciConductor').value;
const placa= document.getElementById('placa').value;
const tipoVehiculo= document.getElementById('tipoVehiculo').value;

   // const cuerpoTabla= document.getElementById("cuerpoTabla").value;
    //despues de capturar todos los datos se le enviaran a la funcion generatePdf por parametro:

    generatePdf(inputNombre,inputRuc,inputNroControl,inputNroGuia,inputDireccion,inputFecha,inputLicencia,pago,totalFactura,SubtotalFactura,ExoneradototalFactura,conductor,ciConductor,placa,tipoVehiculo);
}

//funcion de generar el pdf:

async function generatePdf(inputNombre,inputRuc,inputNroControl,inputNroGuia,inputDireccion,inputFecha,inputLicencia,pago,totalFactura,SubtotalFactura,ExoneradototalFactura,conductor,ciConductor,placa,tipoVehiculo){
    const image= await loadImage('factura.jpg');
    //para atrapar la firma digital:
    //const signatureImage = signaturePad.toDataURL()
   
    const pdf= new jsPDF('p', 'pt','letter');
    pdf.addImage(image,'PNG',0,0,565,792);
    //pdf.addImage(signatureImage,'PNG',200,615,300,50)
    //tamaño de la fuente:
    pdf.setFontSize(12);
    
    //fecha:
    pdf.text(inputFecha,260,125)

    //primero es eje x y luego eje y nombre:
    pdf.text(inputNombre,150,165)
    //nr control 
    pdf.text(inputNroControl,495,95)
     //nr guia 
     pdf.text(inputNroGuia,495,130)

    //direccion:
    pdf.text(inputDireccion,150,192)
    //rif:
    pdf.text(inputRuc,150,217);
    //licencia:
    pdf.text(inputLicencia,150,248);
    //forma de pago:
    pdf.text(pago,150,273);
    //total factura
    pdf.text(totalFactura,390,680);

    //subtotal

    pdf.text(SubtotalFactura,240,680)
    
    //exonerado
    pdf.text(ExoneradototalFactura,83,625)

    //conductor,ciConductor,placa

    pdf.text(conductor,35,750)

    pdf.text(ciConductor,140,750)

    pdf.text(placa,360,750)

    pdf.text(tipoVehiculo,270,750)
    
    
    //pdf.text(inputNro,170,200)
     
    

    //tabla prueba

    //pdf.text(cuerpoTabla,200,500)
     //email:
     //pdf.text(email,170,200)

    //dibujar circulo:
    //pdf.setFillColor(0,0,0)

    //Para hacer la seleccion de hijos dinamica(y poner el circulo dinamico) primero convierto la variable hijos en un entero:(conparseInt) para igualarlo a '0' o a 1
   
    var y = 20;  
    pdf.setLineWidth(1);  
    //pdf.text(100, y = y + 30, "example.pdf");  
    pdf.autoTable({  
        html: '#cuerpoTabla',  
        startY: 350,  
        theme: 'grid',  
        columnStyles: {  
            0: {  
                cellWidth: 60,  
            },  
            1: {  
                cellWidth: 80,  
            },  
            2: {  
                cellWidth: 40,  
            },
            3:{
                cellWidth: 40,  
            } ,
            4:{
                cellWidth: 40,
            },
            5:{
                cellWidth: 60,
            },

            6:{
                cellWidth: 40,
            },

            7:{
                cellWidth: 40,
            },
            8:{
                cellWidth: 40,
            },

            9:{
                cellWidth: 60,
            },
            

        },  
        styles: {  
            minCellHeight: 10  
        }  
    })  
   // pdf.save('Marks_Of_Students.pdf');  
   
    //autoTable(doc, { html: '#cuerpoTabla' })
   // doc.autoTable({ html: '#cuerpoTabla' })
   // doc.save('table.pdf')

    pdf.save('example.pdf')

}