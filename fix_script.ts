import fs from 'fs';

function replaceAny() {
    const files = ['src/app/actions/admin-airlines.ts', 'src/app/actions/admin-policies.ts', 'src/app/measure/components/bagfit-checker-form.tsx'];

    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/data: any/g, 'data: Record<string, any>'); // We will type this properly next
        fs.writeFileSync(file, content);
    }
}
replaceAny();
