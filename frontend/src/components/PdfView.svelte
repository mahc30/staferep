<script>
    import PdfViewer from 'svelte-pdf';
    export let id;
</script>
 
<PdfViewer url={`http://localhost:3000/obras/download/${id}`} 
showBorder={false}
scale={1} />