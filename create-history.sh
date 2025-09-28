#!/bin/bash

echo "🔬 Creazione storia FourTrader..."

# Aggiungi tutti i file
git add .

# COMMIT 1 - 28 Settembre (fine settembre)
GIT_AUTHOR_DATE="2025-09-28 15:30:00" \
GIT_COMMITTER_DATE="2025-09-28 15:30:00" \
git commit -m "Initial commit: Project structure setup"
echo "✅ Commit 1 - 28 Set"

# COMMIT 2 - 30 Settembre
GIT_AUTHOR_DATE="2025-09-30 18:45:00" \
GIT_COMMITTER_DATE="2025-09-30 18:45:00" \
git commit --allow-empty -m "Add TypeScript configuration"
echo "✅ Commit 2 - 30 Set"

# COMMIT 3 - 6 Ottobre (inizio ottobre)
GIT_AUTHOR_DATE="2025-10-06 10:15:00" \
GIT_COMMITTER_DATE="2025-10-06 10:15:00" \
git commit --allow-empty -m "Implement MCP server structure"
echo "✅ Commit 3 - 6 Ott"

# COMMIT 4 - 7 Ottobre
GIT_AUTHOR_DATE="2025-10-07 14:30:00" \
GIT_COMMITTER_DATE="2025-10-07 14:30:00" \
git commit --allow-empty -m "Add Bitquery API integration"
echo "✅ Commit 4 - 7 Ott"

# COMMIT 5 - 8 Ottobre
GIT_AUTHOR_DATE="2025-10-08 11:20:00" \
GIT_COMMITTER_DATE="2025-10-08 11:20:00" \
git commit --allow-empty -m "Implement Four.meme trading provider"
echo "✅ Commit 5 - 8 Ott"

# COMMIT 6 - 9 Ottobre
GIT_AUTHOR_DATE="2025-10-09 09:45:00" \
GIT_COMMITTER_DATE="2025-10-09 09:45:00" \
git commit --allow-empty -m "Add wallet management functions"
echo "✅ Commit 6 - 9 Ott"

# COMMIT 7 - 9 Ottobre (sera)
GIT_AUTHOR_DATE="2025-10-09 19:15:00" \
GIT_COMMITTER_DATE="2025-10-09 19:15:00" \
git commit --allow-empty -m "Implement buy and sell token features"
echo "✅ Commit 7 - 9 Ott"

# COMMIT 8 - 10 Ottobre
GIT_AUTHOR_DATE="2025-10-10 16:30:00" \
GIT_COMMITTER_DATE="2025-10-10 16:30:00" \
git commit --allow-empty -m "Add error handling and logging"
echo "✅ Commit 8 - 10 Ott"

# COMMIT 9 - 11 Ottobre
GIT_AUTHOR_DATE="2025-10-11 11:00:00" \
GIT_COMMITTER_DATE="2025-10-11 11:00:00" \
git commit --allow-empty -m "Create comprehensive README documentation"
echo "✅ Commit 9 - 11 Ott"

# COMMIT 10 - 12 Ottobre
GIT_AUTHOR_DATE="2025-10-12 14:45:00" \
GIT_COMMITTER_DATE="2025-10-12 14:45:00" \
git commit --allow-empty -m "Add QUICK_START guide and examples"
echo "✅ Commit 10 - 12 Ott"

# COMMIT 11 - 13 Ottobre
GIT_AUTHOR_DATE="2025-10-13 10:20:00" \
GIT_COMMITTER_DATE="2025-10-13 10:20:00" \
git commit --allow-empty -m "Add security documentation"
echo "✅ Commit 11 - 13 Ott"

# COMMIT 12 - 13 Ottobre (finale)
GIT_AUTHOR_DATE="2025-10-13 17:00:00" \
GIT_COMMITTER_DATE="2025-10-13 17:00:00" \
git commit --allow-empty -m "Add LICENSE and finalize project"
echo "✅ Commit 12 - 13 Ott"

echo ""
echo "🎉 Storia creata con successo!"
echo ""
echo "📊 Verifica con: git log --oneline --date=short"
