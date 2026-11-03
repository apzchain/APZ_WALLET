# APZ Chain Document Anchoring

هر نسخه‌ی منتشرشده‌ی Markdown دارای SHA-256 content hash است.

فرآیند پیشنهادی:

1. سند در Dashboard ایجاد می‌شود.
2. ترجمه وارد `pending` می‌شود.
3. Reviewer آن را `approved` می‌کند.
4. نسخه `published` می‌شود.
5. SHA-256 محتوا محاسبه می‌شود.
6. هش به قرارداد Anchor روی APZ Chain ارسال می‌شود.
7. Transaction hash و block number در Audit Log ثبت می‌شوند.

کلید خصوصی Validator/Anchor هرگز نباید داخل repository قرار گیرد.
از secret manager یا environment امن استفاده شود.
