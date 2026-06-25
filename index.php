<?php
// Define o diretório atual
$dir = __DIR__;

// Lê os arquivos e remove os atalhos de sistema '.' e '..'
$items = array_diff(scandir($dir), array('.', '..'));

// Ordena os itens em ordem alfabética natural (independente de maiúsculas/minúsculas)
natcasesort($items);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Índice do Diretório</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background-color: #f9f9f9; color: #333; }
        h2 { border-bottom: 2px solid #ccc; padding-bottom: 10px; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 8px 0; }
        a { text-decoration: none; color: #0066cc; font-size: 16px; }
        a:hover { text-decoration: underline; }
        .folder { font-weight: bold; color: #d9822b; }
        .folder::before { content: "📁 "; }
        .file::before { content: "📄 "; }
    </style>
</head>
<body>

    <h2>Índice de: <?php echo htmlspecialchars(basename($dir)); ?></h2>

    <ul>
        <?php foreach ($items as $item): ?>
            <?php 
            // Oculta o próprio arquivo index.php da listagem
            if ($item === 'index.php') {
                continue; 
            }
            
            // Valida o caminho completo para identificar se é pasta ou arquivo
            $fullPath = $dir . DIRECTORY_SEPARATOR . $item;
            $isDir = is_dir($fullPath);
            
            // Define a classe CSS e adiciona a barra '/' se for pasta
            $class = $isDir ? 'folder' : 'file';
            $suffix = $isDir ? '/' : '';
            ?>
            <li>
                <a class="<?php echo $class; ?>" href="<?php echo rawurlencode($item) . $suffix; ?>">
                    <?php echo htmlspecialchars($item) . $suffix; ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>

</body>
</html>