import pdf2json from 'pdf2json';
const parser = new pdf2json();
parser.on('pdfParser_dataError', (err) => {
    console.error(err);
});
parser.on('pdfParser_dataReady', (data) => {
    console.log(data);
});
parser.loadPDF('../../data/Zauber.pdf');
