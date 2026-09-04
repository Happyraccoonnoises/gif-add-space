<?php
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax',
]);
session_start();

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$feedback = '';
$now = time();
$attemptWindow = 300;
$maximumAttempts = 8;
$attempts = array_values(array_filter(
    $_SESSION['code_attempts'] ?? [],
    static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $now - $attemptWindow
));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_SESSION['secret_authorized'])) {
    $submittedToken = is_string($_POST['csrf_token'] ?? null) ? $_POST['csrf_token'] : '';
    $submittedCode = is_string($_POST['code'] ?? null) ? trim($_POST['code']) : '';

    if (!hash_equals($_SESSION['csrf_token'], $submittedToken)) {
        http_response_code(400);
        $feedback = 'Die Anfrage ist abgelaufen. Lade die Seite neu und versuche es noch einmal.';
    } elseif (count($attempts) >= $maximumAttempts) {
        http_response_code(429);
        $feedback = 'Zu viele Versuche. Warte bitte fünf Minuten.';
    } elseif (!preg_match('/^[0-9]{3}$/D', $submittedCode)) {
        $attempts[] = $now;
        $feedback = 'Code nicht erkannt. Versuch es noch einmal.';
    } else {
        $salt = hex2bin('d92e1e11c6cf41aaed93cc8de06fb678');
        $expectedHash = hex2bin('73c972c0f9b1282ca1f6edd3bd596c783735d7753008928147da0b5ad22528f2');
        $submittedHash = hash_pbkdf2('sha256', $submittedCode, $salt, 200000, 32, true);

        if (hash_equals($expectedHash, $submittedHash)) {
            session_regenerate_id(true);
            $_SESSION['secret_authorized'] = true;
            $_SESSION['code_attempts'] = [];
            header('Location: /', true, 303);
            exit;
        }

        $attempts[] = $now;
        $feedback = 'Code nicht erkannt. Versuch es noch einmal.';
    }

    $_SESSION['code_attempts'] = $attempts;
}

$isAuthorized = !empty($_SESSION['secret_authorized']);
?>
<!doctype html>
<html class="no-js" lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signal – FrequenZ Kollektiv</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/new-pages.css">
  <meta name="description" content="Ein verborgenes Signal des FrequenZ Kollektivs.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="icon.png">
  <meta name="theme-color" content="#000000">
</head>

<body class="secret-page">
  <main class="secret-shell">
    <a class="secret-brand" href="/" aria-label="Zurück zur Startseite">
      <img src="assets/1_FZ_Logo_Standart_Color.svg" alt="FrequenZ Kollektiv">
    </a>

    <?php if (!$isAuthorized): ?>
      <section id="secret-gate" class="secret-gate" aria-labelledby="secret-title">
        <p class="secret-status">SIGNAL / GESCHÜTZT</p>
        <h1 id="secret-title">Kennst du<br>die Frequenz?</h1>
        <p class="secret-copy">Gib den Code ein, um das Signal zu entschlüsseln.</p>

        <form id="secret-form" class="secret-form" method="post" action="/">
          <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
          <label for="secret-code">Zugangscode</label>
          <div class="secret-input-row">
            <input id="secret-code"
                   name="code"
                   type="password"
                   inputmode="numeric"
                   pattern="[0-9]{3}"
                   maxlength="3"
                   autocomplete="one-time-code"
                   aria-describedby="secret-feedback"
                   <?= $feedback !== '' ? 'aria-invalid="true"' : '' ?>
                   required>
            <button type="submit">Prüfen →</button>
          </div>
          <p id="secret-feedback" class="secret-feedback" aria-live="polite"><?= htmlspecialchars($feedback, ENT_QUOTES, 'UTF-8') ?></p>
        </form>
      </section>
    <?php else: ?>
      <section id="secret-reveal" class="secret-reveal" aria-labelledby="reveal-title">
        <p class="secret-status">SIGNAL / ENTSCHLÜSSELT</p>
        <h1 id="reveal-title">Du bist<br>drin.</h1>
        <div class="secret-invitation-placeholder">
          <span>PLACEHOLDER / INVITATION</span>
          <p>
            Rauschen wird zu Rhythmus. Die nächsten Koordinaten erscheinen hier,
            sobald das Signal vollständig ist.
          </p>
        </div>
      </section>
    <?php endif; ?>
  </main>
</body>
</html>
