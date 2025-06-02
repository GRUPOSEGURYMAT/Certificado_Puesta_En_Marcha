
function descargarPDF() {
  console.log('Función descargarPDF iniciada');

  // Debug: Confirmar que jsPDF está disponible
  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.error('jsPDF no está cargado');
    return;
  }
  console.log('jsPDF cargado correctamente');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 8;
  const pageWidth = 297 - 2 * margin;
  let y = margin;

  //Pie de página
function addFooter() {
  console.log('Añadiendo pie de página');
  
  const footerHeight = 14; // Altura total del pie de página (antes 8)
  const footerY = 210 - margin - footerHeight; // Ajusta la posición vertical según la altura
  
  doc.setFillColor(125, 213, 251); // #7dd5fb
  doc.rect(margin, footerY, pageWidth, footerHeight, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(0);

  doc.setFont('helvetica', 'normal'); // quitar negrita

  
  const line1 = 'NO MAS FUEGO SL - C.I.F. B01737113';
  const line2 = 'C/Miguel Delibes, Nº5';
  const line3 = 'Mérida (06800) Badajoz';
  
  const centerX = margin + pageWidth / 2;
  
  // Ajusta las posiciones Y para que el texto quede centrado verticalmente
  doc.text(line1, centerX, footerY + 4, { align: 'center' });
  doc.text(line2, centerX, footerY + 8, { align: 'center' });
  doc.text(line3, centerX, footerY + 12, { align: 'center' });
}



  // Opciones comunes para tablas
  const commonTableOptions = {
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 1.5, font: 'helvetica', lineWidth: 0.1, lineColor: [179, 230, 250] }, // #b3e6fa
    headStyles: { fillColor: [57, 180, 230], textColor: [255, 255, 255], fontSize: 10 }, // #39b4e6
    bodyStyles: { fillColor: [248, 252, 255], textColor: [51, 51, 51], fontSize: 10 }, // #f8fcff
    theme: 'grid',
    fontStyle: 'bold'
  };

  // Sección 1: Certificado
  console.log('Procesando sección certificado');
  const certNumber = document.querySelector('#cert-number-3').value;
  const title = `CERTIFICADO DE PUESTA EN MARCHA Nº ${certNumber}`;
  const subtitle = 'INSTALACIÓN AUTOMÁTICA PARA ESTACIONES DE SERVICIO Y EXTINTORES PORTÁTILES';

  // Encabezado
  console.log('Añadiendo encabezado');
  doc.setFillColor(125, 213, 251); // #7dd5fb
  doc.rect(margin, y, pageWidth, 14, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 12, y + 6);
  doc.setFontSize(10);
  doc.text(subtitle, margin + 12, y + 11);
  y += 15;

  // Cuadrícula
  console.log('Añadiendo cuadrícula');
  const certInputs = document.querySelectorAll('.certificado-grid .certificado-content:nth-child(2) input');
  const empresaInputs = document.querySelectorAll('.certificado-grid .certificado-content:nth-child(4) input, .certificado-grid .certificado-content:nth-child(4) textarea');
  const ingenieroInputs = document.querySelectorAll('.certificado-grid .certificado-content:nth-child(6) input');
  const clienteInputs = document.querySelectorAll('.certificado-grid .certificado-content:nth-child(8) input');
  const instalacionInputs = document.querySelectorAll('.certificado-grid .certificado-content:nth-child(10) input');

  doc.autoTable({
    ...commonTableOptions,
    startY: y,
    body: [
      ['CERTIFICADO', `Referencia: ${certInputs[0].value}\nFecha certificación: ${certInputs[1].value}\nTipo: ${certInputs[2].value}\nFecha Vencimiento: ${certInputs[3].value}`],
      ['EMPRESA\nMANTENEDORA\nE INSTALADORA', `Nombre: ${empresaInputs[0].value}\nTeléfono: ${empresaInputs[1].value}\nDirección: ${empresaInputs[2].value}\nCiudad: ${empresaInputs[3].value}\nCorreo: ${empresaInputs[4].value}\nWeb: ${empresaInputs[5].value}\nDescripción: ${empresaInputs[6].value}`],
      ['INGENIERO\nRESPONSABLE', `Nombre: ${ingenieroInputs[0].value}\nTítulo: ${ingenieroInputs[1].value}`],
      ['DATOS CLIENTE', `Nombre: ${clienteInputs[0].value}\nCIF: ${clienteInputs[1].value}\nDirección: ${clienteInputs[2].value}\nCiudad: ${clienteInputs[3].value}`],
      ['DATOS INSTALACIÓN', `Nombre: ${instalacionInputs[0].value}\nCIF: ${instalacionInputs[1].value}\nDirección: ${instalacionInputs[2].value}\nCiudad: ${instalacionInputs[3].value}`]
    ],
    columnStyles: {
      0: { cellWidth: 50, fillColor: [57, 180, 230], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', valign: 'middle' }, // 210px aprox. 50mm
      1: { cellWidth: pageWidth - 50, fillColor: [248, 252, 255], halign: 'left', valign: 'top' }
    },
    bodyStyles: { minCellHeight: 15 },
    didParseCell: (data) => {
      if (data.row.index === 1 && data.column.index === 1) {
        data.cell.styles.minCellHeight = 30; // Más altura para EMPRESA
      }
    }
  });
  y = doc.lastAutoTable.finalY + 1;

  // Tabla sistemas
  console.log('Añadiendo tabla sistemas');
  const sistemaRows = Array.from(document.querySelectorAll('.tabla-sistemas tbody tr')).map(row => {
    const inputs = row.querySelectorAll('input');
    return [
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].value,
      inputs[4].value,
      inputs[5].value,
      inputs[6].value,
      inputs[7].value
    ];
  });
  doc.autoTable({
    ...commonTableOptions,
    startY: y,
    head: [['TIPO SISTEMA', 'CALLE MATADERO Nº5', 'TOTAL', 'CORRECTOS', 'INCORRECTOS', 'INCORRECTOS SOLUCIONADOS', 'INCORRECTOS PENDIENTES', 'ANOMALÍAS PENDIENTES']],
    body: sistemaRows,
    columnStyles: {
      0: { cellWidth: 50, fillColor: [243, 250, 255], textColor: [0, 85, 128], fontStyle: 'bold', halign: 'left' }, // #f3faff
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 25, halign: 'center' },
      7: { cellWidth: 25, fillColor: [181, 225, 247], halign: 'center' } // #b5e1f7
    }
  });
  y = doc.lastAutoTable.finalY + 2;

  addFooter();

  // Página normativa
 console.log('Procesando sección normativa');
doc.addPage();
y = margin;
doc.setFillColor(125, 213, 251);
doc.rect(margin, y, pageWidth, 14, 'F');
doc.setFontSize(14);
doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'normal');
doc.text(title, margin + 12, y + 6);
doc.setFontSize(10);
doc.text(subtitle, margin + 12, y + 11);

// Aumentamos el padding top aquí:
y += 25;  // antes era 15, ahora es 25 para más espacio arriba

doc.setFontSize(10);
doc.setTextColor(0);
doc.text(document.querySelector('.normativa-desc').value, margin, y, { maxWidth: pageWidth });

addFooter();


  // Página DEXA
  console.log('Procesando sección DEXA');
  doc.addPage();
  y = margin;
  doc.setFillColor(125, 213, 251);
  doc.rect(margin, y, pageWidth, 14, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin + 12, y + 6);
  doc.setFontSize(10);
  doc.text(subtitle, margin + 12, y + 11);
  y += 25;

  doc.setFontSize(10);
  doc.setTextColor(230, 0, 0);
  doc.text('RESULTADO REVISIÓN EQUIPAMIENTOS', margin, y);
  y += 5;
  doc.setTextColor(0);
  const dexaRows = Array.from(document.querySelectorAll('.dexa-table tr')).slice(2).map(row => {
    const cells = row.querySelectorAll('td');
    return [
      cells[0].querySelector('input').value,
      cells[1].querySelector('input').value,
      cells[2].querySelector('input').value,
      cells[3].querySelector('input').value,
      cells[4].querySelector('input').value,
      cells[5].querySelector('input').value,
      cells[6].querySelector('select').value,
      cells[7].querySelector('select').value,
      cells[8].querySelector('select').value,
      cells[9].querySelector('select').value,
      cells[10].querySelector('select').value,
      cells[11].querySelector('select').value,
      cells[12].querySelector('select').value,
      cells[13].querySelector('select').value
    ];
  });
  doc.autoTable({
    ...commonTableOptions,
    startY: y,
    head: [[{ content: 'DEXA TIPO A2 50KG', colSpan: 14, styles: { fillColor: [242, 242, 242], textColor: [0, 127, 163], fontSize: 10 } }], [
      'Nº DE PLACA EQUIPO DEXA',
      'FECHA INSTALACIÓN',
      'FECHA PRÓXIMO RETIMBRADO',
      'Nº ISLAS',
      'Nº MÓDULO DIFUSOR/DETECTOR',
      'Nº DE CALLE',
      'DISTANCIA SURTIDOR +1M',
      'SCHMERSAL (ATEX)',
      'POSEE CABLE PARA MANIOBRA DE CORTE ELÉCTRICO',
      'POSTE DISPARO REMOTO',
      'POSEE CABLE PARA MANIOBRA DE POSTE REMOTO',
      'PULSADOR DENTRO DE LA ISLETA',
      'PULSADOR X CADA ISLA',
      'AREA DE POSICIONAMIENTO 3X4'
    ]],
    body: dexaRows,
    columnStyles: Array(14).fill().map(() => ({ cellWidth: (pageWidth - 16) / 14, halign: 'center' })),
    headStyles: { fillColor: [230, 0, 0], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 8 }
  });
  y = doc.lastAutoTable.finalY + 2;

  // Tabla aclaraciones
  console.log('Procesando sección aclaraciones');
  doc.setFontSize(10);
  doc.setTextColor(230, 0, 0);
  doc.text('Observaciones Generales:', margin, y);
  y += 5;
  doc.setTextColor(0);
  const aclaracionesRows = Array.from(document.querySelectorAll('.aclaraciones tr')).slice(1).map(row => [
    row.querySelector('.observacion-fecha').value,
    row.querySelector('.observacion-texto').value
  ]);
  doc.autoTable({
    ...commonTableOptions,
    startY: y,
    head: [['FECHA', 'ACLARACIONES OBSERVADAS']],
    body: aclaracionesRows,
    columnStyles: { 0: { cellWidth: 30, halign: 'center' }, 1: { cellWidth: pageWidth - 30, halign: 'left' } }
  });

  addFooter();

  console.log('Guardando PDF');
  doc.save(`Certificado_Puesta_en_Marcha_${certNumber}.pdf`);
}

function addDexaRow() {
  console.log('Añadiendo fila DEXA');
  const table = document.getElementById('dexaTable');
  const row = table.insertRow(-1);
  const cellTemplates = [
    '<input type="text">',
    '<input type="date">',
    '<input type="date">',
    '<input type="number" min="0">',
    '<input type="number" min="0">',
    '<input type="text">',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>NO</option><option>SÍ</option></select>',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>SÍ</option><option>NO</option></select>',
    '<select><option>NO</option><option>SÍ</option></select>'
  ];
  for (let i = 0; i < cellTemplates.length; i++) {
    let cell = row.insertCell(i);
    cell.innerHTML = cellTemplates[i];
  }
}

function addAclaracionRow() {
  console.log('Añadiendo fila aclaraciones');
  const table = document.getElementById('aclaracionesTable');
  const row = table.insertRow(-1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  cell1.innerHTML = '<input type="date" class="observacion-fecha">';
  cell2.innerHTML = '<textarea class="observacion-texto" rows="3"></textarea>';
}