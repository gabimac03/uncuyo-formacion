(function() {
      // Encapsular en función para evitar contaminar el scope global
      const caScope = {
        $: s => document.querySelector(s),
        tbody: null,
        allRequests: [],

        init: function() {
          this.tbody = this.$('#caTable tbody');
          this.bindEvents();
          this.load();
        },

        pill: function(s) {
          const statusMap = {
            'pending': 'Pendiente',
            'approved': 'Aprobado', 
            'rejected': 'Rechazado'
          };
          return `<span class="ca-pill ${s}">${statusMap[s] || s}</span>`;
        },

        showMessage: function(text, isError = false) {
          const msg = this.$('#caMsg');
          msg.textContent = text;
          msg.className = `ca-message ${isError ? 'error' : ''}`;
          msg.style.display = text ? 'block' : 'none';
        },

        showLoading: function(show = true) {
          if (show) {
            this.tbody.innerHTML = '<tr><td colspan="10" class="ca-loading">Cargando solicitudes</td></tr>';
          }
        },

        updateStats: function(requests) {
          const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length
          };
          
          this.$('#caTotalCount').textContent = stats.total;
          this.$('#caPendingCount').textContent = stats.pending;
          this.$('#caApprovedCount').textContent = stats.approved;
          this.$('#caRejectedCount').textContent = stats.rejected;
          this.$('#caStats').style.display = 'flex';
        },

        filterRequests: function() {
          const statusFilter = this.$('#caFStatus').value;
          const searchTerm = this.$('#caSearchInput').value.toLowerCase();
          
          let filtered = this.allRequests;
          
          if (statusFilter) {
            filtered = filtered.filter(r => r.status === statusFilter);
          }
          
          if (searchTerm) {
            filtered = filtered.filter(r => 
              r.username.toLowerCase().includes(searchTerm) ||
              (r.fullName || '').toLowerCase().includes(searchTerm) ||
              (r.email || '').toLowerCase().includes(searchTerm)
            );
          }
          
          this.renderTable(filtered);
        },

        renderTable: function(requests) {
          if (requests.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #9ca3af;">No se encontraron solicitudes</td></tr>';
            return;
          }

          this.tbody.innerHTML = requests.map(row => {
            const noteVal = row.note ? row.note.replace(/"/g,'&quot;') : '';
            const createdDate = new Date(row.createdAt).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return `<tr data-id="${row.id}">
              <td><strong>${row.id}</strong></td>
              <td><strong>${row.username}</strong></td>
              <td>${row.fullName || '-'}</td>
              <td>${row.email || '-'}</td>
              <td><strong>${row.year}</strong></td>
              <td>${this.pill(row.status)}</td>
              <td>${createdDate}</td>
              <td>${row.reviewedByUsername || '-'}</td>
              <td>
                <input class="ca-note-input" type="text" value="${noteVal}" placeholder="Agregar nota..." />
              </td>
              <td class="ca-row-actions">
                ${row.status !== 'approved' ? '<button class="ca-approve ca-btn ca-btn-success">✓ Aprobar</button>' : ''}
                ${row.status !== 'rejected' ? '<button class="ca-reject ca-btn ca-btn-danger">✗ Rechazar</button>' : ''}
              </td>
            </tr>`
          }).join('');
          
          this.bindRowActions();
        },

        load: async function() {
          try {
            this.showLoading(true);
            this.showMessage('');
            
            const r = await fetch('/api/admin/cert-requests');
            const data = await r.json().catch(() => ({}));
            
            if (!r.ok || !data.ok) {
              throw new Error(data.error || 'Error cargando solicitudes');
            }
            
            this.allRequests = data.requests || [];
            this.updateStats(this.allRequests);
            this.filterRequests();
            
          } catch (error) {
            console.error('Error loading requests:', error);
            this.showMessage(error.message || 'Error cargando solicitudes', true);
            this.tbody.innerHTML = '';
          }
        },

        bindRowActions: function() {
          this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.querySelector('.ca-approve')?.addEventListener('click', () => this.update(tr, 'approved'));
            tr.querySelector('.ca-reject')?.addEventListener('click', () => this.update(tr, 'rejected'));
          });
        },

        update: async function(tr, status) {
          const id = tr.getAttribute('data-id');
          const note = tr.querySelector('.ca-note-input')?.value || '';
          
          try {
            const button = tr.querySelector(status === 'approved' ? '.ca-approve' : '.ca-reject');
            const originalText = button.textContent;
            button.textContent = 'Procesando...';
            button.disabled = true;
            
            const r = await fetch(`/api/admin/cert-requests/${id}/status`, {
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({ status, note })
            });
            
            const data = await r.json().catch(() => ({}));
            
            if (!r.ok || !data.ok) {
              throw new Error(data.error || 'No se pudo actualizar');
            }
            
            // Actualizar el request en memoria
            const requestIndex = this.allRequests.findIndex(req => req.id == id);
            if (requestIndex !== -1) {
              this.allRequests[requestIndex].status = status;
              this.allRequests[requestIndex].note = note;
            }
            
            this.updateStats(this.allRequests);
            this.filterRequests();
            
            this.showMessage(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'} correctamente`);
            
          } catch (error) {
            console.error('Error updating request:', error);
            this.showMessage(error.message || 'Error actualizando solicitud', true);
            
            // Restaurar botón
            const button = tr.querySelector(status === 'approved' ? '.ca-approve' : '.ca-reject');
            if (button) {
              button.textContent = originalText;
              button.disabled = false;
            }
          }
        },

        bindEvents: function() {
          this.$('#caBtnReload').addEventListener('click', () => this.load());
          this.$('#caFStatus').addEventListener('change', () => this.filterRequests());
          this.$('#caSearchInput').addEventListener('input', () => this.filterRequests());
        }
      };

      // Inicializar cuando el DOM esté listo
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => caScope.init());
      } else {
        caScope.init();
      }
    })();


        const $ = s => document.querySelector(s);
    const tbody = $('#tbl tbody');

    function pill(s){ return `<span class="pill ${s}">${s}</span>`; }

    async function load() {
      $('#msg').textContent = 'Cargando...';
      const st = $('#fStatus').value;
      const url = '/api/admin/cert-requests' + (st ? ('?status=' + encodeURIComponent(st)) : '');
      const r = await fetch(url);
      const data = await r.json().catch(()=>({}));
      if (!r.ok || !data.ok) {
        $('#msg').textContent = data.error || 'Error cargando';
        tbody.innerHTML = '';
        return;
      }
      $('#msg').textContent = '';
      tbody.innerHTML = data.requests.map(row => {
        const noteVal = row.note ? row.note.replace(/"/g,'&quot;') : '';
        return `<tr data-id="${row.id}">
          <td>${row.id}</td>
          <td>${row.username}</td>
          <td>${row.fullName || ''}</td>
          <td>${row.email || ''}</td>
          <td>${row.year}</td>
          <td>${pill(row.status)}</td>
          <td>${new Date(row.createdAt).toLocaleString()}</td>
          <td>${row.reviewedByUsername || ''}</td>
          <td><input class="note" type="text" value="${noteVal}" /></td>
          <td class="row-actions">
            <button class="approve btn">Aprobar</button>
            <button class="reject">Rechazar</button>
          </td>
        </tr>`
      }).join('');
      bindRowActions();
    }

    function bindRowActions() {
      tbody.querySelectorAll('tr').forEach(tr => {
        tr.querySelector('.approve')?.addEventListener('click', () => update(tr, 'approved'));
        tr.querySelector('.reject')?.addEventListener('click', () => update(tr, 'rejected'));
      });
    }

    async function update(tr, status) {
      const id = tr.getAttribute('data-id');
      const note = tr.querySelector('.note')?.value || '';
      const r = await fetch(`/api/admin/cert-requests/${id}/status`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status, note })
      });
      const data = await r.json().catch(()=>({}));
      if (!r.ok || !data.ok) {
        alert(data.error || 'No se pudo actualizar');
        return;
      }
      await load();
    }

    $('#btnReload').addEventListener('click', load);
    $('#fStatus').addEventListener('change', load);
    load();