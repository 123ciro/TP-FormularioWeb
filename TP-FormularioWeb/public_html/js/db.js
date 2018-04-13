/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
function startDB() {
    dataBase = indexedDB.open('Registros', 1);
    dataBase.onupgradeneeded = function (e) {
        var active = dataBase.result;
        var object = active.createObjectStore("alumnos", {keyPath: 'id', autoIncrement: true});
        // object.createIndex('id_alumno', 'id', {unique: true});
        object.createIndex('nombre_alumno', 'nombre', {unique: false});
        object.createIndex('cedula_alumno', 'cedula', {unique: true});
        object.createIndex('apellido_alumno', 'apellido', {unique: false});
        object.createIndex('fechanaci_alumno', 'fechanaci', {unique: false});
        object.createIndex('edad_alumno', 'edad', {unique: false});
        object.createIndex('correo_alumno', 'correo', {unique: false});
        object.createIndex('sexo_alumno', 'sexo', {unique: false});
        object.createIndex('tipoestudio_elumno', 'tipoestudio', {unique: false});
        object.createIndex('cel_alumno', 'cel', {unique: false});
    };

    dataBase.onsuccess = function (e) {
        //  alert('Base de Datos Activa');
        CargaDb();
    };
    dataBase.onerror = function (e) {
        alert('Error loading database');
    };
}

function add() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var object = data.objectStore("alumnos");
    var request = object.put({
        cedula: document.querySelector("#cedula").value,
        nombre: document.querySelector("#nombre").value,
        apellido: document.querySelector("#apellido").value,
        fechanaci: document.querySelector("#fechanaci").value,
        edad: document.querySelector("#edad").value,
        correo: document.querySelector("#correo").value,
        sexo: document.querySelector("#sexo").value,
        tipoestudio: document.querySelector("#tipoestudio").value,
        cel: document.querySelector("#cel").value
    });
    request.onerror = function (e) {
        $('#cedula').focus();
    };
    data.oncomplete = function (e) {
        document.querySelector('#cedula').value = '';
        document.querySelector('#nombre').value = '';
        document.querySelector('#apellido').value = '';
        document.querySelector('#fechanaci').value = '';
        document.querySelector('#edad').value = '';
        document.querySelector('#correo').value = '';
        document.querySelector('#sexo').value = '';
        document.querySelector('#tipoestudio').value = '';
        document.querySelector('#cel').value = '';
        $('#carga').fadeIn();
        $('#errorcarga').hide();
        $('#carga').fadeOut(3000);
        $('#cedula').focus();
        CargaDb();
        limpiarcampos();
    };
}
function CargaDb() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        var outerHTML = '';
        for (var key in elements) {
            outerHTML += '\n\
                        <tr>\n\
                            <td>' + elements[key].id + '</td>\n\
                            <td>' + elements[key].cedula + '</td>\n\
                            <td>' + elements[key].nombre + '</td>\n\
                            <td>' + elements[key].apellido + '</td>\n\
                            <td>' + elements[key].fechanaci + '</td>\n\
                            <td>' + elements[key].edad + '</td>\n\
                            <td>' + elements[key].correo + '</td>\n\
                            <td>' + elements[key].sexo + '</td>\n\
                            <td>' + elements[key].tipoestudio + '</td>\n\
                            <td>' + elements[key].cel + '</td> \n\
                            <td>\n\<button type="button" onclick="recuperar(' + elements[key].id + ')" class="btn btn-info">Edit</button>\n\
                            <td>\n\<button type="button" onclick="deletedate(' + elements[key].id + ')" class="btn btn-danger">Remove</button>\n\
                                                    </tr>';
        }
        elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
    };
}
// Este codigo es para el modeal
//<td>\n\<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal">Remove</button>\n\

function recuperar(id) {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var index = object.index("id_alumno");
    var request = index.get(id);

    $("#cargas").show();
    $("#busquedaregistro").hide();


    request.onsuccess = function () {
        var result = request.result;
        if (result !== undefined) {
            document.querySelector('#cedula').value = result.cedula;
            document.querySelector('#nombre').value = result.nombre;
            document.querySelector('#apellido').value = result.apellido;
            document.querySelector('#fechanaci').value = result.fechanaci;
            document.querySelector('#edad').value = result.edad;
            document.querySelector('#correo').value = result.correo;
            document.querySelector('#sexo').value = result.sexo;
            document.querySelector('#tipoestudio').value = result.tipoestudio;
            document.querySelector('#cel').value = result.cel;

            $('#registrar').attr("disabled", true);
            $('#editar').attr("disabled", false);

        }
    };
}


function modificar() {
  
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var objectStore = data.objectStore("alumnos");
    var index = objectStore.index('id_alumno');
     
    

    index.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var updateData = cursor.value;
//            updateData.cedula = document.querySelector("#cedula").value;
            updateData.nombre = document.querySelector("#nombre").value;
            updateData.apellido = document.querySelector("#apellido").value;
            updateData.fechanaci = document.querySelector("#fechanaci").value;
            updateData.sexo = document.querySelector("#sexo").value;
            updateData.edad = document.querySelector("#edad").value;
            updateData.tipoestudio = document.querySelector("#tipoestudio").value;
            updateData.correo = document.querySelector("#correo").value;
            updateData.cel = document.querySelector("#cel").value;
            var request = cursor.update(updateData);
            request.onsuccess = function () {
                $("#modifi").fadeIn();
                $("#modifi").fadeOut(3000);
                CargaDb();
                limpiarcampos();
                $('#editar').attr("disabled", true);
                $('#registrar').attr("disabled", false);
            };
            request.onerror = function () {
                alert('Error' + '/n/n' + request.error.name + '\n\n' + request.error.message);
                CargaDb();
            };
        }
    }
    ;
}

function deletedate(id) {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var object = data.objectStore("alumnos");
    var request = object.delete(id);
   request.onsuccess = function () {
        swal("Dato Eliminado");
        $("#cedula").focus();
        CargaDb();
    };
}

//function delet(id) {
//
//    var active = dataBase.result;
//    var data = active.transaction(["alumnos"], "readwrite");
//    var object = data.objectStore("alumnos");
//
//    // primero buscamos el registro a partir del ci
//    var index = object.index("id_alumno");
//    var request = index.get(document.querySelector("#id").value);
//
//    // cuando se encuentre el registro, lo borramos
//    request.onsuccess = function () {
//        var result = request.result;
//        object.delete(result.id);
//    };
//}

function BusquedaciAdmi() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {

        for (var key in elements) {

            var cedula = elements[key].cedula;

            if (cedula === $("#cedula").val()) {
                recuperar(elements[key].id);
            }
        }
        elements = [];
    };
}

function BusquedaCiUsuario() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        for (var key in elements) {
            var cedula = elements[key].cedula;
            if (cedula === $("#cedula").val()) {
                $("#cedula").focus();
                $('#errorcarga').fadeIn();
                $('#errorcarga').fadeOut(4000);
                console.log("cedula ya existe");
                $("#cedula").val("");
            }
        }
        elements = [];
    };
} 